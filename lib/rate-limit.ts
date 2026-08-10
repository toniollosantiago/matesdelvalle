/**
 * Simple in-memory rate limiter using a Map.
 * For production with Upstash Redis, set UPSTASH_REDIS_REST_URL and
 * UPSTASH_REDIS_REST_TOKEN and switch to the Upstash implementation.
 */

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

/** Memory store for dev when Upstash is not configured */
const memoryStore = new Map<string, { count: number; resetAt: number }>()

/** Clean up old entries periodically */
function cleanupMemoryStore() {
  const now = Date.now()
  for (const [key, value] of memoryStore.entries()) {
    if (value.resetAt < now) memoryStore.delete(key)
  }
}

interface RateLimitConfig {
  maxRequests: number
  windowMs: number // milliseconds
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: Date
}

/**
 * Rate limit a key (e.g. IP address).
 * Uses Upstash Redis if configured, falls back to in-memory store.
 */
export async function checkRateLimit(
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const { maxRequests, windowMs } = config

  if (UPSTASH_URL && UPSTASH_TOKEN) {
    return checkRateLimitUpstash(key, config)
  }

  // Fallback: in-memory (single instance, works for dev/small deployments)
  cleanupMemoryStore()

  const now = Date.now()
  const existing = memoryStore.get(key)

  if (!existing || existing.resetAt < now) {
    const resetAt = now + windowMs
    memoryStore.set(key, { count: 1, resetAt })
    return { allowed: true, remaining: maxRequests - 1, resetAt: new Date(resetAt) }
  }

  existing.count++
  const remaining = Math.max(0, maxRequests - existing.count)
  const allowed = existing.count <= maxRequests

  return { allowed, remaining, resetAt: new Date(existing.resetAt) }
}

async function checkRateLimitUpstash(
  key: string,
  { maxRequests, windowMs }: RateLimitConfig
): Promise<RateLimitResult> {
  const windowSeconds = Math.floor(windowMs / 1000)
  const now = Date.now()
  const windowKey = `rl:${key}:${Math.floor(now / windowMs)}`
  const resetAt = new Date(Math.ceil(now / windowMs) * windowMs)

  try {
    // INCR + EXPIRE via Upstash REST API
    const res = await fetch(`${UPSTASH_URL}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', windowKey],
        ['EXPIRE', windowKey, windowSeconds],
      ]),
    })

    if (!res.ok) throw new Error('Upstash error')

    const data = await res.json()
    const count: number = data[0]?.result ?? 1
    const remaining = Math.max(0, maxRequests - count)
    const allowed = count <= maxRequests

    return { allowed, remaining, resetAt }
  } catch {
    // If Upstash fails, allow the request but log
    console.error('[rate-limit] Upstash error, allowing request')
    return { allowed: true, remaining: maxRequests, resetAt }
  }
}

/** Helper to get client IP from Next.js request headers */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') ?? 'unknown'
}
