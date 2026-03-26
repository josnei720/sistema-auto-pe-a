import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'Falta o ID da peça' }, { status: 400 });

    await prisma.part.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Erro ao excluir peça:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'Falta o ID da peça' }, { status: 400 });

    const body = await request.json();
    
    // Convert numeric fields properly (Prisma throws if null passed to non-optional Float/Int)
    const dataToUpdate = {
      ...body,
      preco_custo: body.preco_custo ? parseFloat(body.preco_custo) : 0,
      preco_venda: body.preco_venda ? parseFloat(body.preco_venda) : 0,
      quantidade: parseInt(body.quantidade) || 0,
      quantidade_minima: parseInt(body.quantidade_minima) || 5,
      quantidade_maxima: body.quantidade_maxima ? parseInt(body.quantidade_maxima) : null,
    };

    // Remove immutable fields from payload to avoid Prisma conflicts
    delete dataToUpdate.id;
    delete dataToUpdate.data_cadastro;
    delete dataToUpdate.ano_inicio;
    delete dataToUpdate.ano_fim;

    const updated = await prisma.part.update({
      where: { id },
      data: dataToUpdate
    });

    return NextResponse.json({ success: true, part: updated }, { status: 200 });
  } catch (error) {
    console.error('Erro ao editar peça:', error);
    return NextResponse.json({ error: 'Erro interno ao editar a peça' }, { status: 500 });
  }
}
