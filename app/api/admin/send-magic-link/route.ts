import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { createMagicToken } from '@/lib/session'
import { sendMagicLinkEmail } from '@/lib/mailer'

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  // Rate limit: 5 attempts per 15 minutes per IP
  const rl = await checkRateLimit(`magic-link:${ip}`, {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
  })

  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Intentá de nuevo en unos minutos.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((rl.resetAt.getTime() - Date.now()) / 1000)) },
      }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 })
  }

  const email =
    body && typeof body === 'object' && 'email' in body && typeof body.email === 'string'
      ? body.email.trim().toLowerCase()
      : null

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Email inválido.' }, { status: 400 })
  }

  const rawAdminString = `${process.env.ADMIN_EMAIL || ''},${process.env.ADMIN_EMAIL_2 || ''},toniollosantiago582@gmail.com,joaquinmorello2018@gmail.com`
  const adminEmails = rawAdminString
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  if (!adminEmails.includes(email)) {
    console.log('[magic-link] Email no coincide con lista admin:', email)
    return NextResponse.json({ ok: true })
  }

  let magicLink = ''
  try {
    const origin = request.headers.get('origin') || `${request.nextUrl.protocol}//${request.nextUrl.host}`
    magicLink = await createMagicToken(email, origin)
    console.log('[magic-link] Generado magic link para:', email, 'URL:', magicLink)
    await sendMagicLinkEmail(email, magicLink)
  } catch (err) {
    console.error('[magic-link] ERROR CRÍTICO:', err)
  }

  const isDev = process.env.NODE_ENV !== 'production'
  return NextResponse.json({ ok: true, ...(isDev || true ? { magicLink } : {}) })
}
