import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const config = await prisma.config.findFirst({
      where: { id: 1 }
    });
    
    // Se não existir, retorna os defaults do schema (o Prisma cuidará disso se usarmos findUnique ou se o usuário criar)
    return NextResponse.json(config || {
      nome_empresa: "AutoSystem",
      simbolo_moeda: "R$",
      limite_estoque_baixo: 5
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar configurações' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome_empresa, simbolo_moeda, limite_estoque_baixo, n8n_webhook_url } = body;

    const config = await prisma.config.upsert({
      where: { id: 1 },
      update: {
        nome_empresa,
        simbolo_moeda,
        limite_estoque_baixo: Number(limite_estoque_baixo),
        n8n_webhook_url
      },
      create: {
        id: 1,
        nome_empresa,
        simbolo_moeda,
        limite_estoque_baixo: Number(limite_estoque_baixo),
        n8n_webhook_url
      }
    });

    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao salvar configurações' }, { status: 500 });
  }
}
