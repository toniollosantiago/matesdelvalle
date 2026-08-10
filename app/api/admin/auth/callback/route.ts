import { NextRequest, NextResponse } from 'next/server'
import { validateMagicToken } from '@/lib/session'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/panel-control/login?error=missing', request.url))
  }

  const ok = await validateMagicToken(token)

  if (!ok) {
    return NextResponse.redirect(new URL('/panel-control/login?error=invalid', request.url))
  }

  return NextResponse.redirect(new URL('/panel-control', request.url))
}
