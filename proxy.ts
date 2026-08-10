import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /panel-control routes (excluding login and auth callback)
  if (
    pathname.startsWith('/panel-control') &&
    !pathname.startsWith('/panel-control/login') &&
    !pathname.startsWith('/panel-control/auth')
  ) {
    const sessionCookie = request.cookies.get('mdv_session')

    if (!sessionCookie?.value) {
      const loginUrl = new URL('/panel-control/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/panel-control/:path*'],
}
