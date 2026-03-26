'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Box, MapPin, DollarSign, Tag } from 'lucide-react';
import MultiSelect from '@/components/MultiSelect';

const COMUM_MARCAS = [
  "Volkswagen", "Fiat", "Chevrolet", "Ford", "Renault", "Peugeot", "Citroën", 
  "Honda", "Toyota", "Hyundai", "Jeep", "Nissan", "Mitsubishi", "Kia", "Dodge"
].sort();

const MODELOS_POR_MARCA: Record<string, string[]> = {
  "Fiat": ["Elba", "Prêmio", "Duna", "Fiorino", "Tipo", "Tempra", "Brava", "Marea", "Stilo", "Siena", "Palio Weekend", "Linea", "Doblo", "Ducato", "Palio", "Uno", "Strada"],
  "Volkswagen": ["Fusca", "Kombi", "Brasília", "Variant", "Passat", "Santana", "Quantum", "Parati", "Pointer", "Logus", "Apollo", "Polo", "Gol", "Fox", "Saveiro"],
  "Chevrolet": ["Chevette", "Opala", "Monza", "Kadett", "Ipanema", "Omega", "Suprema", "Vectra", "Astra", "Zafira", "Meriva", "Corsa", "Celta", "Prisma", "Onix", "S10"],
  "Ford": ["Corcel", "Belina", "Del Rey", "Pampa", "Escort", "Verona", "Versailles", "Royale", "Fiesta", "Courier", "Focus", "Ka"],
  "Hyundai": ["HB20"],
  "Toyota": ["Corolla", "Hilux"],
  "Honda": ["Civic"],
  "Jeep": ["Compass", "Renegade"]
};

const COMUM_ANOS = Array.from({length: 67}, (_, i) => (new Date().getFullYear() - 65 + i).toString()).reverse(); 
const COMUM_MOTORES = [
  "1.0 8V", "1.0 16V", "1.3 8V", "1.4 8V", "1.5 8V", "1.6 8V", "1.6 16V", 
  "1.8 8V", "1.8 16V", "2.0 8V", "2.0 16V", "2.2 8V", "2.4 16V", "4.1", "V6", "V8"
];
const COMUM_CORREDORES = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const COMUM_PRATELEIRAS = Array.from({length: 10}, (_, i) => String(i + 1).padStart(2, '0'));
const COMUM_GAVETAS = Array.from({length: 10}, (_, i) => "CX-" + String(i + 1).padStart(2, '0'));

interface PartFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function PartForm({ initialData, isEdit = false }: PartFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Parse year strings like "2015-2020" into start and end
  let initAnoInicio = '';
  let initAnoFim = '';
  if (initialData?.aplicacao_ano_modelo) {
    const years = initialData.aplicacao_ano_modelo.split(/[-a]/).map((s: string) => s.trim().replace(/\D/g, ''));
    if (years.length === 2 && years[0] && years[1]) {
      initAnoInicio = years[0];
      initAnoFim = years[1];
    } else if (years.length > 0 && years[0]) {
      initAnoInicio = years[0];
    }
  }

  const [formData, setFormData] = useState({
    sku: initialData?.sku || '',
    nome_produto: initialData?.nome_produto || '',
    descricao_detalhada: initialData?.descricao_detalhada || '',
    marca_peca: initialData?.marca_peca || '',
    codigo_fabricante: initialData?.codigo_fabricante || '',
    marca_veiculo: initialData?.marca_veiculo || '',
    aplicacao_veiculos: initialData?.aplicacao_veiculos || '',
    ano_inicio: initAnoInicio,
    ano_fim: initAnoFim,
    aplicacao_motor: initialData?.aplicacao_motor || '',
    preco_custo: initialData?.preco_custo || '',
    preco_venda: initialData?.preco_venda || '',
    quantidade: initialData?.quantidade || '1',
    quantidade_minima: initialData?.quantidade_minima || '5',
    quantidade_maxima: initialData?.quantidade_maxima || '',
    local_prateleira: initialData?.local_prateleira || '',
    local_corredor: initialData?.local_corredor || '',
    local_caixa: initialData?.local_caixa || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getFilteredModelos = () => {
    const selectedBrands = formData.marca_veiculo.split(',').map((s: string) => s.trim()).filter(Boolean);
    const allModels = Object.values(MODELOS_POR_MARCA).flat().sort();
    if (selectedBrands.length === 0) return allModels;

    let availableModels: string[] = [];
    selectedBrands.forEach((brand: string) => {
      const key = Object.keys(MODELOS_POR_MARCA).find(k => k.toLowerCase() === brand.toLowerCase());
      if (key) availableModels.push(...MODELOS_POR_MARCA[key]);
    });

    return availableModels.length > 0 ? availableModels.sort() : allModels;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let anoLabel = '';
    if (formData.ano_inicio && formData.ano_fim) {
      anoLabel = formData.ano_inicio === formData.ano_fim ? formData.ano_inicio : `${formData.ano_inicio}-${formData.ano_fim}`;
    } else if (formData.ano_inicio) {
      anoLabel = `A partir de ${formData.ano_inicio}`;
    } else if (formData.ano_fim) {
      anoLabel = `Até ${formData.ano_fim}`;
    }

    const payload = { ...formData, aplicacao_ano_modelo: anoLabel };

    try {
      const url = isEdit ? `/api/parts/${initialData.id}` : '/api/parts';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        router.push('/parts');
        router.refresh();
      } else {
        alert('Erro ao salvar peça.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  const SectionTitle = ({ title, icon: Icon }: { title: string, icon: any }) => (
    <h3 className="flex items-center gap-2 text-lg font-semibold text-white border-b border-[#374151] pb-2 mb-4 mt-8 first:mt-0">
      <Icon className="w-5 h-5 text-blue-500" />
      {title}
    </h3>
  );

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-[#1f2937]/40 backdrop-blur-md rounded-2xl border border-[#374151] shadow-2xl space-y-8">
      {/* Botão Flutuante (Save) para componentes grandes */}
      <div className="absolute top-8 right-8 z-50">
        <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50">
          {loading ? 'Salvando...' : <><Save className="w-4 h-4" /> Salvar</>}
        </button>
      </div>

      <div>
        <SectionTitle title="Identificação do Produto" icon={Tag} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">Nome do Produto *</label>
            <input required type="text" name="nome_produto" value={formData.nome_produto} onChange={handleChange} className="w-full px-4 py-2 bg-[#111827] border border-[#374151] rounded-xl text-white focus:ring-2 focus:ring-blue-500" placeholder="Ex: Pastilha de Freio Dianteira" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">SKU</label>
            <input type="text" name="sku" disabled={isEdit} value={formData.sku} onChange={handleChange} className="w-full px-4 py-2 bg-[#111827] border border-[#374151] rounded-xl text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50" placeholder="Gerado Auto" />
          </div>
          <div className="lg:col-span-3">
            <label className="block text-sm font-medium text-gray-400 mb-1">Descrição Detalhada / Aplicação</label>
            <textarea name="descricao_detalhada" rows={3} value={formData.descricao_detalhada} onChange={handleChange} className="w-full px-4 py-2 bg-[#111827] border border-[#374151] rounded-xl text-white focus:ring-2 focus:ring-blue-500" placeholder="Detalhes, material, observações vitais..." />
          </div>
        </div>
      </div>

      <div>
        <SectionTitle title="Dados do Fabricante & Veículo" icon={Box} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-40">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Marca da Peça</label>
            <input type="text" name="marca_peca" value={formData.marca_peca} onChange={handleChange} className="w-full px-4 py-2 bg-[#111827] border border-[#374151] rounded-xl text-white focus:ring-2 focus:ring-blue-500" placeholder="Ex: Bosch, Nakata" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Código do Fabricante</label>
            <input type="text" name="codigo_fabricante" value={formData.codigo_fabricante} onChange={handleChange} className="w-full px-4 py-2 bg-[#111827] border border-[#374151] rounded-xl text-white focus:ring-2 focus:ring-blue-500" placeholder="P/N Fabricante" />
          </div>
          
          <div className="relative z-50">
            <MultiSelect name="marca_veiculo" label="Marcas de Veículo" placeholder="Selecione Marcas..." options={COMUM_MARCAS} value={formData.marca_veiculo} onChange={(val) => handleMultiSelect('marca_veiculo', val)} />
          </div>
          
          <div className="relative z-40">
            <MultiSelect name="aplicacao_veiculos" label="Modelos Compatíveis" placeholder="Modelos..." options={getFilteredModelos()} value={formData.aplicacao_veiculos} onChange={(val) => handleMultiSelect('aplicacao_veiculos', val)} />
          </div>

          <div className="relative z-30 flex flex-col gap-1 justify-end">
            <label className="block text-sm font-medium text-gray-400 mb-0.5">Ano(s) de Fabricação</label>
            <div className="flex gap-2 items-center">
              <select className="w-full px-3 py-[9px] bg-[#111827] border border-[#374151] rounded-xl text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.ano_inicio} onChange={(e) => handleMultiSelect('ano_inicio', e.target.value)}>
                <option value="">De...</option>
                {[...COMUM_ANOS].reverse().map(ano => <option key={`inicio-${ano}`} value={ano}>{ano}</option>)}
              </select>
              <span className="text-gray-500 text-sm">até</span>
              <select className="w-full px-3 py-[9px] bg-[#111827] border border-[#374151] rounded-xl text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.ano_fim} onChange={(e) => handleMultiSelect('ano_fim', e.target.value)}>
                <option value="">Até...</option>
                {COMUM_ANOS.map(ano => <option key={`fim-${ano}`} value={ano}>{ano}</option>)}
              </select>
            </div>
          </div>

          <div className="relative z-20">
            <MultiSelect name="aplicacao_motor" label="Motorizações" placeholder="Motores..." options={COMUM_MOTORES} value={formData.aplicacao_motor} onChange={(val) => handleMultiSelect('aplicacao_motor', val)} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        <div>
          <SectionTitle title="Valores" icon={DollarSign} />
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Custo (R$)</label>
              <input type="number" step="0.01" name="preco_custo" value={formData.preco_custo} onChange={handleChange} className="w-full px-4 py-2 bg-[#111827] border border-[#374151] rounded-xl text-white focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Venda (R$)</label>
              <input type="number" step="0.01" name="preco_venda" value={formData.preco_venda} onChange={handleChange} className="w-full px-4 py-2 bg-[#111827] border border-[#374151] rounded-xl text-white focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>
        <div>
          <SectionTitle title="Estoque" icon={Box} />
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Qtd Atual (Altera apenas em Adicionar. Para Editar, use Entradas/Saídas)</label>
              <input type="number" min="0" disabled={isEdit} required name="quantidade" value={formData.quantidade} onChange={handleChange} className="w-full px-4 py-2 bg-[#111827] border border-[#374151] rounded-xl text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Estoque Mín.</label>
                <input type="number" min="0" name="quantidade_minima" value={formData.quantidade_minima} onChange={handleChange} className="w-full px-4 py-2 bg-[#111827] border border-[#374151] rounded-xl text-white focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Estoque Máx.</label>
                <input type="number" min="0" name="quantidade_maxima" value={formData.quantidade_maxima} onChange={handleChange} className="w-full px-4 py-2 bg-[#111827] border border-[#374151] rounded-xl text-white focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-0">
        <SectionTitle title="Localização no Almoxarifado" icon={MapPin} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative z-30"><MultiSelect name="local_corredor" label="Corredor" placeholder="Selecione..." options={COMUM_CORREDORES} value={formData.local_corredor} onChange={(val) => handleMultiSelect('local_corredor', val)} /></div>
          <div className="relative z-20"><MultiSelect name="local_prateleira" label="Prateleira" placeholder="Selecione..." options={COMUM_PRATELEIRAS} value={formData.local_prateleira} onChange={(val) => handleMultiSelect('local_prateleira', val)} /></div>
          <div className="relative z-10"><MultiSelect name="local_caixa" label="Caixa / Gaveta" placeholder="Selecione..." options={COMUM_GAVETAS} value={formData.local_caixa} onChange={(val) => handleMultiSelect('local_caixa', val)} /></div>
        </div>
      </div>
    </form>
  );
}
