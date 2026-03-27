import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const { usuario, password } = await req.json()

    if (!usuario || !password) {
      return NextResponse.json(
        { message: 'Usuário e senha são obrigatórios' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { usuario }
    })

    if (!user || user.senha !== password) {
      return NextResponse.json(
        { message: 'Usuário ou senha incorretos' },
        { status: 401 }
      )
    }

    const response = NextResponse.json({ message: 'Login realizado com sucesso' })
    
    response.cookies.set('session', 'true', {
      httpOnly: true,
      secure: false, // Compatível com HTTP/HTTPS
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
      sameSite: 'lax',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Erro interno no servidor' },
      { status: 500 }
    )
  }
}
