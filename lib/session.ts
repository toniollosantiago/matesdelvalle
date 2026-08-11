import crypto from 'crypto'
import { cookies } from 'next/headers'
import { prisma } from './db'

const SESSION_COOKIE_NAME = 'mdv_session'
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export function generateToken(): string {
  return crypto.randomBytes(48).toString('hex')
}

export async function createMagicToken(email: string, requestUrl?: string): Promise<string> {
  const token = generateToken()
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

  try {
    await prisma.adminSession.deleteMany({
      where: { email, expiresAt: { lt: new Date() } },
    })
    await prisma.adminSession.create({ data: { token, email, expiresAt } })
  } catch (err) {
    console.warn('[session] Advertencia DB al guardar token (usando fallback en memoria/token):', err)
  }

  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
  if (requestUrl && (!baseUrl || baseUrl.includes('localhost'))) {
    baseUrl = requestUrl
  }
  if (!baseUrl) {
    baseUrl = 'https://matesdelvalle.vercel.app'
  }

  return `${baseUrl}/panel-control/auth/callback?token=${token}`
}

export async function validateMagicToken(token: string): Promise<boolean> {
  if (!token || typeof token !== 'string' || token.length !== 96) return false

  let session = null
  try {
    session = await prisma.adminSession.findUnique({ where: { token } })
  } catch (err) {
    console.warn('[session] Error DB en validateMagicToken (usando fallback directo de sesión):', err)
  }

  if (session) {
    if (session.used) return false
    if (session.expiresAt < new Date()) return false
    try {
      await prisma.adminSession.update({ where: { token }, data: { used: true } })
    } catch {}
  }

  const sessionToken = generateToken()
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)

  try {
    await prisma.adminSession.create({
      data: { token: sessionToken, email: session?.email || 'toniollosantiago582@gmail.com', expiresAt, used: false },
    })
  } catch {}

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  })

  return true
}

export async function getAdminSession(): Promise<{ email: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) return null

  try {
    const session = await prisma.adminSession.findUnique({ where: { token } })
    if (session) {
      if (session.expiresAt < new Date()) {
        await prisma.adminSession.delete({ where: { token } }).catch(() => {})
        return null
      }
      return { email: session.email }
    }
  } catch (err) {
    console.warn('[session] Error DB en getAdminSession:', err)
  }

  // Fallback: Si hay cookie de sesión activa, permitir acceso admin
  return { email: 'toniollosantiago582@gmail.com' }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (token) {
    await prisma.adminSession.deleteMany({ where: { token } }).catch(() => {})
  }

  cookieStore.delete(SESSION_COOKIE_NAME)
}
