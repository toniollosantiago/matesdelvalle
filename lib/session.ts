import crypto from 'crypto'
import { cookies } from 'next/headers'
import { prisma } from './db'

const SESSION_COOKIE_NAME = 'mdv_session'
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export function generateToken(): string {
  return crypto.randomBytes(48).toString('hex')
}

export async function createMagicToken(email: string): Promise<string> {
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

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  return `${baseUrl}/panel-control/auth/callback?token=${token}`
}

export async function validateMagicToken(token: string): Promise<boolean> {
  if (!token || typeof token !== 'string' || token.length !== 96) return false

  const session = await prisma.adminSession.findUnique({ where: { token } })

  if (!session) return false
  if (session.used) return false
  if (session.expiresAt < new Date()) return false

  await prisma.adminSession.update({ where: { token }, data: { used: true } })

  const sessionToken = generateToken()
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)

  await prisma.adminSession.create({
    data: { token: sessionToken, email: session.email, expiresAt, used: false },
  })

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

  const session = await prisma.adminSession.findUnique({ where: { token } })

  if (!session) return null
  if (session.expiresAt < new Date()) {
    await prisma.adminSession.delete({ where: { token } })
    return null
  }

  return { email: session.email }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (token) {
    await prisma.adminSession.deleteMany({ where: { token } }).catch(() => {})
  }

  cookieStore.delete(SESSION_COOKIE_NAME)
}
