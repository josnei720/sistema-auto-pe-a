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

    const cookieStore = await cookies()
    cookieStore.set('session', JSON.stringify({ id: user.id, usuario: user.usuario, role: user.role }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 dia
      path: '/',
    })

    return NextResponse.json({ message: 'Login realizado com sucesso' })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Erro interno no servidor' },
      { status: 500 }
    )
  }
}
