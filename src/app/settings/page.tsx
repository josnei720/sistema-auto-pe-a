'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, Bell, Globe, Building2, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [config, setConfig] = useState({
    nome_empresa: 'AutoSystem',
    simbolo_moeda: 'R$',
    limite_estoque_baixo: 5,
    n8n_webhook_url: ''
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setConfig(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Falha ao salvar:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-400">Carregando configurações...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-600/20 rounded-2xl">
          <Settings className="w-8 h-8 text-blue-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Configurações</h1>
          <p className="text-gray-400">Personalize o comportamento do seu sistema</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Identidade */}
        <div className="bg-[#1f2937]/50 border border-[#374151] rounded-3xl p-8 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="w-5 h-5 text-gray-400" />
            <h2 className="text-xl font-semibold text-white">Identidade do Sistema</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Nome da Empresa</label>
              <input
                type="text"
                value={config.nome_empresa}
                onChange={e => setConfig({...config, nome_empresa: e.target.value})}
                className="w-full bg-[#111827] border border-[#374151] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Símbolo da Moeda</label>
              <input
                type="text"
                value={config.simbolo_moeda}
                onChange={e => setConfig({...config, simbolo_moeda: e.target.value})}
                className="w-full bg-[#111827] border border-[#374151] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Alertas */}
        <div className="bg-[#1f2937]/50 border border-[#374151] rounded-3xl p-8 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-gray-400" />
            <h2 className="text-xl font-semibold text-white">Alertas de Estoque</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Limite Global de Estoque Baixo</label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={config.limite_estoque_baixo}
                onChange={e => setConfig({...config, limite_estoque_baixo: parseInt(e.target.value)})}
                className="w-32 bg-[#111827] border border-[#374151] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <span className="text-sm text-gray-500 italic">
                * As peças com quantidade igual ou inferior a este valor aparecerão red no Dashboard.
              </span>
            </div>
          </div>
        </div>

        {/* Integrações */}
        <div className="bg-[#1f2937]/50 border border-[#374151] rounded-3xl p-8 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-5 h-5 text-gray-400" />
            <h2 className="text-xl font-semibold text-white">Integrações (n8n Webhook)</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">URL de Webhook para Importação</label>
            <input
              type="url"
              placeholder="https://sua-instancia-n8n.com/..."
              value={config.n8n_webhook_url || ''}
              onChange={e => setConfig({...config, n8n_webhook_url: e.target.value})}
              className="w-full bg-[#111827] border border-[#374151] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center justify-end gap-4 pt-4">
          {success && (
            <div className="flex items-center gap-2 text-emerald-400 font-medium animate-in fade-in slide-in-from-right-4">
              <CheckCircle2 className="w-5 h-5" />
              Configurações salvas!
            </div>
          )}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50"
          >
            {saving ? 'Salvando...' : (
              <>
                <Save className="w-5 h-5" />
                Salvar Alterações
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
