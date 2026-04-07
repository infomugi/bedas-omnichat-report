"use client";

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CampaignTable } from '@/components/campaigns/CampaignTable';
import { mockCampaigns } from '@/lib/mock-data';
import { Plus, FileDown, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function SMSBlastPage() {
  const [campaigns, setCampaigns] = useState(
    mockCampaigns.filter(c => c.type === 'SMS')
  );

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus kampanye SMS ini?')) {
      setCampaigns(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">SMS Blast</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Kelola dan pantau kampanye pesan broadcast SMS Anda.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-dark-border rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all">
              <FileDown size={18} />
              Export CSV
            </button>
            <button className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-600/20">
              <Plus size={18} />
              Buat SMS Baru
            </button>
          </div>
        </div>

        {/* Filter Area */}
        <div className="flex items-center gap-4 bg-white dark:bg-dark-card p-4 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-dark-border rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300">
            <Calendar size={16} className="text-emerald-500" />
            Bulan Ini (April 2026)
          </button>
        </div>

        {/* Campaign Table */}
        <CampaignTable 
          campaigns={campaigns} 
          onDelete={handleDelete}
        />
      </div>
    </AppLayout>
  );
}
