import PartForm from '@/components/PartForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewPartPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/parts" className="p-2 rounded-full bg-[#1f2937]/50 hover:bg-[#374151] text-gray-300 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Adicionar Peça</h2>
          <p className="text-gray-400 mt-1">Cadastro manual completo (ERP)</p>
        </div>
      </div>

      <PartForm />
    </div>
  );
}
