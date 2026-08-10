import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession, destroySession } from '@/lib/session'

export async function POST(request: NextRequest) {
  await getAdminSession() // verify valid session first (proxy already checks, belt+suspenders)
  await destroySession()
  return NextResponse.json({ ok: true })
}
