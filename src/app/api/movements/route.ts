import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { part_id, tipo, quantidade, origem, observacao } = data;

    if (!part_id || !tipo || !quantidade) {
      return NextResponse.json({ error: 'Campos requeridos ausentes' }, { status: 400 });
    }

    const isEntrada = tipo === 'ENTRADA';
    const parsedQty = Math.abs(parseInt(quantidade, 10));

    // Create Movement and Update Part Transactionally
    const [movement, updatedPart] = await prisma.$transaction([
      prisma.stockMovement.create({
        data: {
          part_id,
          tipo,
          quantidade: parsedQty,
          origem: origem || 'AJUSTE',
          observacao: observacao || null
        }
      }),
      prisma.part.update({
        where: { id: part_id },
        data: {
          quantidade: {
            [isEntrada ? 'increment' : 'decrement']: parsedQty
          },
          ...(tipo === 'SAIDA' ? { ultima_venda: new Date() } : {})
        }
      })
    ]);

    return NextResponse.json({ success: true, movement, updatedPart }, { status: 201 });
  } catch (error) {
    console.error('Error in movement:', error);
    return NextResponse.json({ error: 'Erro Interno do Servidor' }, { status: 500 });
  }
}
