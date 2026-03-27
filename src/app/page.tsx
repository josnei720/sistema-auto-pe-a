import prisma from '@/lib/prisma';
export const dynamic = "force-dynamic";
import DashboardCharts from '@/components/DashboardCharts';
import { Package, DollarSign, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const revalidate = 0; // Force dynamic to always show fresh data

export default async function Home() {
  const parts = await prisma.part.findMany();
  const config = await prisma.config.findFirst({ where: { id: 1 } });
  const companyName = config?.nome_empresa || "AutoSystem";
  
  const totalParts = parts.reduce((acc: number, part: any) => acc + part.quantidade, 0);
  const totalItems = parts.length;
  
  const totalValue = parts.reduce((acc: number, part: any) => acc + (part.preco_venda * part.quantidade), 0);
  const totalCost = parts.reduce((acc: number, part: any) => acc + (part.preco_custo * part.quantidade), 0);
  
  const lowStockParts = parts.filter(p => p.quantidade < p.quantidade_minima);

  const recentMovements = await prisma.stockMovement.findMany({
    take: 5,
    orderBy: { data_movimento: 'desc' },
    include: { part: true }
  });

  const aggregateBrands = () => {
    const brands: Record<string, number> = {};
    parts.forEach((p: any) => {
      const brand = p.marca_veiculo || 'Diversos';
      brands[brand] = (brands[brand] || 0) + p.quantidade;
    });
    
    return Object.entries(brands)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  const chartData = aggregateBrands();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard {companyName}</h2>
        <p className="text-gray-400 mt-1">Visão geral do negócio, lucros e alertas de estoque.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-gradient-to-br from-[#1f2937] to-[#111827] rounded-2xl border border-[#374151] shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign className="w-16 h-16 text-emerald-500" />
          </div>
          <p className="text-sm font-medium text-gray-400">Potencial de Venda</p>
          <p className="text-3xl font-bold text-emerald-400 mt-2">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
          </p>
        </div>

        <div className="p-6 bg-gradient-to-br from-[#1f2937] to-[#111827] rounded-2xl border border-[#374151] shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-16 h-16 text-blue-500" />
          </div>
          <p className="text-sm font-medium text-gray-400">Custo Total em Estoque</p>
          <p className="text-3xl font-bold text-blue-400 mt-2">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalCost)}
          </p>
        </div>

        <div className="p-6 bg-gradient-to-br from-[#1f2937] to-[#111827] rounded-2xl border border-[#374151] shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Package className="w-16 h-16 text-purple-500" />
          </div>
          <p className="text-sm font-medium text-gray-400">Volume Total (Peças)</p>
          <p className="text-3xl font-bold text-white mt-2">{totalParts} <span className="text-sm text-gray-500">unids.</span></p>
        </div>

        <div className="p-6 bg-gradient-to-br from-[#1f2937] to-[#111827] rounded-2xl border border-red-500/30 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <AlertTriangle className="w-16 h-16 text-red-500" />
          </div>
          <p className="text-sm font-medium text-red-400">Alertas de Reposição</p>
          <p className="text-3xl font-bold text-red-500 mt-2">{lowStockParts.length} <span className="text-sm text-red-500/50">SKUs</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 p-6 bg-[#1f2937]/40 backdrop-blur-md rounded-2xl border border-[#374151] shadow-xl">
          <h3 className="text-lg font-semibold text-white mb-6">Distribuição por Marca de Veículo</h3>
          <DashboardCharts data={chartData} />
        </div>

        {/* Ledger / Recent Activity */}
        <div className="space-y-6">
          {/* Low Stock Alerts */}
          <div className="p-6 bg-[#1f2937]/40 backdrop-blur-md rounded-2xl border border-[#374151] shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Abaixo do Mínimo
            </h3>
            <div className="space-y-3">
              {lowStockParts.length > 0 ? lowStockParts.slice(0, 4).map(p => (
                <div key={p.id} className="flex justify-between items-center p-3 bg-[#111827] rounded-lg border border-red-500/20">
                  <div>
                    <p className="text-sm font-medium text-gray-200 truncate max-w-[150px]">{p.nome_produto}</p>
                    <p className="text-xs text-gray-500">{p.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-400">{p.quantidade} / {p.quantidade_minima}</p>
                    <p className="text-xs text-gray-500">em estoque</p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-500 text-center py-4">Estoque saudável. Nenhuma peça abaixo do mínimo.</p>
              )}
            </div>
          </div>

          {/* Recent Movements */}
          <div className="p-6 bg-[#1f2937]/40 backdrop-blur-md rounded-2xl border border-[#374151] shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Giro Recente (Ledger)</h3>
            <div className="space-y-3">
              {recentMovements.length > 0 ? recentMovements.map(m => (
                <div key={m.id} className="flex items-center gap-3 p-3 bg-[#111827] rounded-lg border border-[#374151]">
                  <div className={`p-2 rounded-full ${m.tipo === 'ENTRADA' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {m.tipo === 'ENTRADA' ? <ArrowDownRight className="w-4 h-4"/> : <ArrowUpRight className="w-4 h-4"/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">{m.part.nome_produto}</p>
                    <p className="text-xs text-gray-500">{m.tipo} via {m.origem}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${m.tipo === 'ENTRADA' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {m.tipo === 'ENTRADA' ? '+' : '-'}{m.quantidade}
                    </p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-500 text-center py-4">Nenhuma movimentação registrada nas últimas semanas.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
