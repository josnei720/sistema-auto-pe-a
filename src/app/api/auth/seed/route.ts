import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const admin = await prisma.user.upsert({
      where: { usuario: 'josnei' },
      update: {
        senha: 'Clonar77*'
      },
      create: {
        usuario: 'josnei',
        nome: 'Josnei',
        senha: 'Clonar77*',
        role: 'ADMIN'
      },
    })
    
    return NextResponse.json({ 
      message: 'Usuário configurado com sucesso!',
      usuario: admin.usuario 
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Erro ao configurar usuário' }, { status: 500 })
  }
}
