'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Image as ImageIcon, ChevronDown, ChevronUp, FileText, MapPin, Tag, Archive, Trash2, Edit2 } from 'lucide-react';

export type Part = {
  id: string;
  sku: string;
  imagem_id: string | null;
  nome_produto: string;
  descricao_detalhada: string | null;
  marca_peca: string | null;
  codigo_fabricante: string | null;
  marca_veiculo: string | null;
  aplicacao_veiculos: string | null;
  aplicacao_ano_modelo: string | null;
  aplicacao_motor: string | null;
  preco_custo: number;
  preco_venda: number;
  quantidade: number;
  quantidade_minima: number;
  local_prateleira: string | null;
  local_corredor: string | null;
  local_caixa: string | null;
  data_cadastro: Date;
  ultima_compra: Date | null;
  ultima_venda: Date | null;
};

export default function PartsTable({ initialParts }: { initialParts: Part[] }) {
  const [search, setSearch] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filteredParts = initialParts.filter((part) => 
    part.nome_produto.toLowerCase().includes(search.toLowerCase()) ||
    part.sku.toLowerCase().includes(search.toLowerCase()) ||
    (part.marca_veiculo && part.marca_veiculo.toLowerCase().includes(search.toLowerCase())) ||
    (part.aplicacao_veiculos && part.aplicacao_veiculos.toLowerCase().includes(search.toLowerCase())) ||
    (part.codigo_fabricante && part.codigo_fabricante.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-500" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-[#374151] rounded-xl leading-5 bg-[#111827] text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
          placeholder="Buscar por nome, SKU, veículo ou fabricante..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#374151]">
        <table className="min-w-full divide-y divide-[#374151]">
          <thead className="bg-[#111827]">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">SKU & Peça</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Aplicação / Fabricante</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Estoque (Local)</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Valores</th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#374151] bg-[#1f2937]/30">
            {filteredParts.length > 0 ? (
              filteredParts.map((part) => {
                const isLowStock = part.quantidade < part.quantidade_minima;

                return (
                  <React.Fragment key={part.id}>
                    <tr className="hover:bg-[#1f2937]/80 transition-colors cursor-pointer" onClick={() => toggleRow(part.id)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-800 rounded-lg border border-gray-700">
                            <ImageIcon className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-white max-w-[200px] truncate">{part.nome_produto}</div>
                            <div className="text-xs text-blue-400 font-mono mt-0.5">{part.sku}</div>
                            <div className="text-[10px] text-gray-500 mt-1">
                              Cadastrado em: {new Date(part.data_cadastro).toLocaleString('pt-BR')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{part.aplicacao_veiculos || part.marca_peca || '-'}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {part.marca_veiculo || ''} {part.aplicacao_ano_modelo ? `| ${part.aplicacao_ano_modelo}` : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isLowStock ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400'}`}>
                          {part.quantidade} unid. {isLowStock ? '(BAIXO)' : ''}
                        </span>
                        {(part.local_corredor || part.local_prateleira) && (
                          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {part.local_corredor && `C:${part.local_corredor}`}{part.local_prateleira && ` P:${part.local_prateleira}`}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-emerald-400">Venda: R$ {part.preco_venda?.toFixed(2) || '0.00'}</div>
                        <div className="text-xs text-blue-400 font-medium">Margem Bruta: R$ {(part.preco_venda - part.preco_custo).toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 flex justify-end gap-2 items-center">
                        <Link 
                          href={`/parts/${part.id}/edit`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 hover:bg-emerald-500/10 rounded-lg transition-colors text-emerald-400 hover:text-emerald-300"
                          title="Editar Peça"
                        >
                          <Edit2 className="w-5 h-5" />
                        </Link>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if(window.confirm(`ATENÇÃO! Tem certeza que deseja excluir DE VEZ a peça "${part.nome_produto}"? Essa ação apagará também todo o histórico de movimentações dela.`)) {
                              fetch(`/api/parts/${part.id}`, { method: 'DELETE' })
                                .then(() => window.location.reload())
                                .catch(() => alert("Erro ao excluir!"));
                            }
                          }}
                          className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-400 hover:text-red-300"
                          title="Excluir Peça"
                        >
                          <Trash2 className="w-5 h-5"/>
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400 hover:text-blue-300">
                          {expandedRow === part.id ? <ChevronUp className="w-5 h-5"/> : <ChevronDown className="w-5 h-5"/>}
                        </button>
                      </td>
                    </tr>
                    {expandedRow === part.id && (
                      <tr className="bg-[#111827]/80 border-t-0 shadow-inner">
                        <td colSpan={5} className="px-6 py-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-xl border border-[#374151] bg-[#1f2937]/50">
                            
                            {/* Identificação e Descrição */}
                            <div className="space-y-3">
                              <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-300 border-b border-[#374151] pb-2">
                                <FileText className="w-4 h-4 text-blue-400" />
                                Detalhes & Descrição
                              </h4>
                              <p className="text-sm text-gray-400 leading-relaxed font-mono whitespace-pre-wrap">
                                {part.descricao_detalhada || 'Sem descrição detalhada registrada.'}
                              </p>
                            </div>

                            {/* Especificações */}
                            <div className="space-y-3">
                              <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-300 border-b border-[#374151] pb-2">
                                <Tag className="w-4 h-4 text-blue-400" />
                                Identificação Avançada
                              </h4>
                              <ul className="space-y-2 text-sm">
                                <li className="flex justify-between">
                                  <span className="text-gray-500">Marca da Peça:</span>
                                  <span className="text-gray-300 font-medium">{part.marca_peca || 'N/A'}</span>
                                </li>
                                <li className="flex justify-between">
                                  <span className="text-gray-500">Cód. Fabricante:</span>
                                  <span className="text-gray-300 font-medium text-right">{part.codigo_fabricante || 'N/A'}</span>
                                </li>
                                <li className="flex justify-between">
                                  <span className="text-gray-500">Motorização:</span>
                                  <span className="text-gray-300 font-medium">{part.aplicacao_motor || 'N/A'}</span>
                                </li>
                                <li className="flex justify-between border-t border-[#374151] pt-2">
                                  <span className="text-gray-500">Última Venda:</span>
                                  <span className="text-amber-400 font-medium">{part.ultima_venda ? new Date(part.ultima_venda).toLocaleDateString('pt-BR') : 'Nunca vendida'}</span>
                                </li>
                              </ul>
                            </div>

                            {/* Localização Fsica e Logistica */}
                            <div className="space-y-3">
                              <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-300 border-b border-[#374151] pb-2">
                                <Archive className="w-4 h-4 text-blue-400" />
                                Localização Completa & Logística
                              </h4>
                              <ul className="space-y-2 text-sm">
                                <li className="flex justify-between">
                                  <span className="text-gray-500">Corredor:</span>
                                  <span className="text-emerald-400 font-bold">{part.local_corredor || 'N/A'}</span>
                                </li>
                                <li className="flex justify-between">
                                  <span className="text-gray-500">Prateleira:</span>
                                  <span className="text-emerald-400 font-bold">{part.local_prateleira || 'N/A'}</span>
                                </li>
                                <li className="flex justify-between">
                                  <span className="text-gray-500">Caixa:</span>
                                  <span className="text-emerald-400 font-bold">{part.local_caixa || 'N/A'}</span>
                                </li>
                                <li className="flex justify-between border-t border-[#374151] pt-2">
                                  <span className="text-gray-500">Mínimo no Estoque:</span>
                                  <span className="text-gray-300 font-medium">{part.quantidade_minima} unid.</span>
                                </li>
                              </ul>
                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                  Nenhuma peça encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
