"use client";

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CampaignTable } from '@/components/campaigns/CampaignTable';
import { getCampaigns, deleteCampaign } from '@/app/actions/campaigns';
import { Plus, FileDown, Calendar, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { CreateCampaignForm } from '@/components/campaigns/CreateCampaignForm';

export default function SMSBlastPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await getCampaigns('SMS');
    setCampaigns(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus kampanye SMS ini?')) {
      const { error } = await deleteCampaign(id);
      if (error) {
        alert('Gagal menghapus kampanye: ' + error);
        return;
      }
      setCampaigns(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleCreateSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/sms/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          sender: formData.sender,
          message: formData.message,
          targetCount: 350000, // Mocked for now in UI anyway
        }),
      });

      const result = await response.json();
      if (result.success) {
        setIsCreating(false);
        loadData();
      } else {
        alert('Gagal membuat kampanye: ' + result.error);
      }
    } catch (err: any) {
      alert('Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout title={isCreating ? "Buat SMS Blast Baru" : "SMS Blast"}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              {isCreating ? "Setup Kampanye SMS" : "SMS Blast"}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {isCreating ? "Konfigurasi pesan dan target pengiriman SMS Anda." : "Kelola dan pantau kampanye pesan broadcast SMS Anda."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isCreating ? (
              <button 
                onClick={() => setIsCreating(false)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-dark-border rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all"
              >
                <ArrowLeft size={18} />
                Kembali
              </button>
            ) : (
              <>
                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-dark-border rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all">
                  <FileDown size={18} />
                  Export CSV
                </button>
                <button 
                  onClick={() => setIsCreating(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-600/20"
                >
                  <Plus size={18} />
                  Buat SMS Baru
                </button>
              </>
            )}
          </div>
        </div>

        {isCreating ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CreateCampaignForm 
              onCancel={() => setIsCreating(false)} 
              onSubmit={handleCreateSubmit} 
            />
          </div>
        ) : (
          <>
            {/* Filter Area */}
            <div className="flex items-center gap-4 bg-white dark:bg-dark-card p-4 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm">
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-dark-border rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300">
                <Calendar size={16} className="text-emerald-500" />
                Bulan Ini (April 2026)
              </button>
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
          </>
        )}
      </div>
    </AppLayout>
  );
}
