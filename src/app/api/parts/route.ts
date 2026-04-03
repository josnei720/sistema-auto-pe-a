import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Dados recebidos do n8n/Agente:', data);

    const sku = data.sku || `SKU-${Date.now().toString().slice(-6)}`;
    
    // Garante que quantidade e preços sejam números válidos
    const quantidade = parseInt(data.quantidade_pecas_iguais || data.quantidade || 1, 10);
    const preco_custo = parseFloat(data.preco_custo || data.custo_medio_internet || 0);
    const preco_venda = parseFloat(data.preco_venda || data.preco_venda_medio_internet || 0);

    const newPart = await prisma.part.create({
      data: {
        sku,
        imagem_id: data.imagem_id?.toString() || null,
        nome_produto: data.nome_produto || 'Produto não identificado',
        descricao_detalhada: data.descricao_detalhada || null,
        marca_peca: data.marca_peca || null,
        codigo_fabricante: data.codigo_fabricante || null,
        
        marca_veiculo: data.marca_carro_compativel || data.marca_veiculo || null,
        aplicacao_veiculos: data.aplicacao_compatibilidade || data.aplicacao_veiculos || null,
        aplicacao_ano_modelo: data.ano_inicio_compativel || data.aplicacao_ano_modelo || null,
        aplicacao_motor: data.aplicacao_motor || null,

        quantidade,
        quantidade_minima: parseInt(data.quantidade_minima || 5, 10),
        quantidade_maxima: data.quantidade_maxima ? parseInt(data.quantidade_maxima, 10) : null,

        preco_custo,
        preco_venda,

        local_prateleira: data.local_prateleira || null,
        local_corredor: data.local_corredor || null,
        local_caixa: data.local_caixa || null,

        fornecedor_id: data.fornecedor_id || null, // Optional

        // Create initial stock movement linked to this part
        movimentacoes: {
          create: {
            tipo: "ENTRADA",
            quantidade,
            origem: data.origem || "N8N_IMPORT",
            observacao: "Cadastro inicial do produto"
          }
        }
      },
    });

    return NextResponse.json({ success: true, part: newPart }, { status: 201 });
  } catch (error) {
    console.error('Error inserting part:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const parts = await prisma.part.findMany({
      orderBy: { data_cadastro: 'desc' },
      include: {
        fornecedor: true,
        // We might want to see the latest movements later
      }
    });
    return NextResponse.json(parts);
  } catch (error) {
    console.error('Error fetching parts:', error);
    return NextResponse.json({ error: 'Failed to fetch parts' }, { status: 500 });
  }
}
