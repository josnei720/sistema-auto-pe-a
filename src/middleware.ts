import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')
  const { pathname } = request.nextUrl

  // Se já está na página de login ou api de auth, deixa passar
  if (pathname.includes('/login') || pathname.includes('/api/auth') || pathname.includes('_next')) {
    return NextResponse.next()
  }

  // Permite que o N8N envie dados sem precisar de login
  if (pathname.startsWith('/api/parts') && request.method === 'POST') {
    return NextResponse.next()
  }

  // Se não tem sessão, manda pro login
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api/auth/seed|_next/static|_next/image|favicon.ico).*)'],
}
