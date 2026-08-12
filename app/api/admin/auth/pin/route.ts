import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { verifyPin, setAdminSessionCookie } from '@/lib/pin-auth'

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  // Rate Limit Estricto: Máximo 5 intentos por IP cada 15 minutos
  const rl = await checkRateLimit(`admin-pin-login:${ip}`, {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
  })

  if (!rl.allowed) {
    const secondsRemaining = Math.ceil((rl.resetAt.getTime() - Date.now()) / 1000)
    return NextResponse.json(
      { error: `Demasiados intentos fallidos. Bloqueado por seguridad (${Math.ceil(secondsRemaining / 60)} min restantes).` },
      {
        status: 429,
        headers: { 'Retry-After': String(secondsRemaining) },
      }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 })
  }

  const pin = body && typeof body === 'object' && 'pin' in body && typeof body.pin === 'string'
    ? body.pin.trim()
    : null

  if (!pin) {
    return NextResponse.json({ error: 'PIN requerido.' }, { status: 400 })
  }

  // Verificar PIN usando comparación en tiempo constante (Timing-Safe)
  const isValid = verifyPin(pin)

  if (!isValid) {
    return NextResponse.json({ error: 'PIN incorrecto.' }, { status: 401 })
  }

  // Emitir cookie cifrada HTTP-only de sesión
  await setAdminSessionCookie()

  return NextResponse.json({ ok: true })
}
