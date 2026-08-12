import crypto from 'crypto'
import { cookies } from 'next/headers'

const SESSION_COOKIE_NAME = 'mdv_session'
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 días

const SESSION_SECRET = process.env.SESSION_SECRET || '17909e690a900ceaa8b337fcd51650576c4571c01cd9946ebdcf994c04178e5a'

// PIN por defecto: 180495 (o el valor de ADMIN_PIN en .env)
const DEFAULT_PIN = process.env.ADMIN_PIN || '180495'

/**
 * Calcula un HASH criptográfico HMAC-SHA256 del PIN.
 */
export function hashPin(pin: string): string {
  return crypto.createHmac('sha256', SESSION_SECRET).update(pin.trim()).digest('hex')
}

/**
 * Hash del PIN configurado en el sistema
 */
const TARGET_PIN_HASH = process.env.ADMIN_PIN_HASH || hashPin(DEFAULT_PIN)

/**
 * Verifica si el PIN ingresado es correcto usando timingSafeEqual para prevenir Timing Attacks
 */
export function verifyPin(inputPin: string): boolean {
  if (!inputPin || typeof inputPin !== 'string') return false
  const inputHash = hashPin(inputPin)

  const a = Buffer.from(inputHash, 'hex')
  const b = Buffer.from(TARGET_PIN_HASH, 'hex')

  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

/**
 * Genera un token de sesión criptográficamente firmado
 */
export function generateSessionToken(): string {
  const randomBytes = crypto.randomBytes(32).toString('hex')
  const timestamp = Date.now().toString()
  const payload = `${randomBytes}.${timestamp}`
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex')
  return `${payload}.${signature}`
}

/**
 * Valida la firma HMAC y expiración del token de sesión
 */
export function verifySessionToken(token: string): boolean {
  if (!token || typeof token !== 'string') return false
  const parts = token.split('.')
  if (parts.length !== 3) return false

  const [randomBytes, timestampStr, signature] = parts
  const payload = `${randomBytes}.${timestampStr}`
  const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex')

  const sigBuffer = Buffer.from(signature, 'hex')
  const expectedBuffer = Buffer.from(expectedSignature, 'hex')

  if (sigBuffer.length !== expectedBuffer.length) return false
  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return false

  const timestamp = parseInt(timestampStr, 10)
  if (isNaN(timestamp)) return false
  if (Date.now() - timestamp > SESSION_DURATION_MS) return false

  return true
}

/**
 * Devuelve la sesión activa de administración o null
 */
export async function getAdminSession(): Promise<{ email: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) return null

  if (verifySessionToken(token)) {
    return { email: 'admin@matesdelvalle.com' }
  }

  return null
}

/**
 * Establece la cookie de sesión cifrada
 */
export async function setAdminSessionCookie(): Promise<void> {
  const sessionToken = generateSessionToken()
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  })
}

/**
 * Elimina la cookie de sesión
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
