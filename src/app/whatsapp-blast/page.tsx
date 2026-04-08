"use client";

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CampaignTable } from '@/components/campaigns/CampaignTable';
import { getCampaigns, deleteCampaign } from '@/app/actions/campaigns';
import { Plus, FileDown, Calendar, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function WhatsAppBlastPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getCampaigns('WhatsApp');
      setCampaigns(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus kampanye ini?')) {
      const { error } = await deleteCampaign(id);
      if (error) {
        alert('Gagal menghapus kampanye: ' + error);
        return;
      }
      setCampaigns(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">WhatsApp Blast</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Kelola dan pantau kampanye pesan broadcast WhatsApp Anda.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-dark-border rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all">
              <FileDown size={18} />
              Export CSV
            </button>
            <Link 
              href="/whatsapp-blast/new"
              className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-600/20"
            >
              <Plus size={18} />
              Buat Blast Baru
            </Link>
          </div>
        </div>

        {/* Filter Area */}
        <div className="flex items-center gap-4 bg-white dark:bg-dark-card p-4 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-dark-border rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300">
            <Calendar size={16} className="text-emerald-500" />
            Bulan Ini (April 2026)
          </button>
          <div className="h-6 w-px bg-slate-200 dark:bg-dark-border mx-2"></div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-100 dark:border-emerald-800/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Report
            </span>
          </div>
        </div>

        {/* Campaign Table */}
        {loading ? (
          <div className="bg-white dark:bg-dark-card p-20 rounded-[2rem] border border-slate-200 dark:border-dark-border flex flex-col items-center justify-center gap-4">
            <Loader2 className="text-emerald-500 animate-spin" size={32} />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Memuat database...</p>
          </div>
        ) : (
          <CampaignTable 
            campaigns={campaigns} 
            onDelete={handleDelete}
          />
        )}
      </div>
    </AppLayout>
  );
}
