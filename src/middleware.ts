import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')
  const { pathname } = request.nextUrl

  // 1. Permitir rotas públicas
  if (
    pathname.startsWith('/login') || 
    pathname.startsWith('/api/auth') ||
    pathname.includes('.') // Arquivos estáticos (favicon, images, etc)
  ) {
    return NextResponse.next()
  }

  // 2. Redirecionar para login se não houver sessão
  if (!session) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Configurar em quais caminhos o middleware deve rodar
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
