import prisma from '@/lib/prisma';
import PartsTable from '@/components/PartsTable';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const revalidate = 0; // Force dynamic to load the freshest parts

export default async function PartsPage() {
  const parts = await prisma.part.findMany({
    orderBy: { data_cadastro: 'desc' }
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Estoque de Peças</h2>
          <p className="text-gray-400 mt-1">Lista completa de peças integradas e manuais.</p>
        </div>
        <Link 
          href="/parts/new" 
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Nova Peça
        </Link>
      </div>

      <div className="p-6 bg-[#1f2937]/40 backdrop-blur-md rounded-2xl border border-[#374151] shadow-xl">
        <PartsTable initialParts={parts} />
      </div>
    </div>
  );
}
