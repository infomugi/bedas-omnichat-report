"use client";

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CreateCampaignForm } from '@/components/campaigns/CreateCampaignForm';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createCampaign } from '@/app/actions/campaigns';

export default function NewWhatsAppBlastPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const result = await createCampaign({
        name: data.name,
        type: 'SMS',
        sender: data.sender,
        category: data.category,
        message: data.message,
        status: data.schedule === 'immediate' ? 'Sent' : 'Draft',
        targetCount: 5000, // Mock for SMS
        successCount: data.schedule === 'immediate' ? 5000 : 0,
        failCount: 0,
        scheduledAt: data.schedule === 'later' ? new Date().toISOString() : undefined
      });

      if (result.error) {
        alert('Gagal membuat kampanye SMS: ' + result.error);
      } else {
        alert('Kampanye SMS Blast berhasil dibuat!');
        router.push('/sms-blast');
      }
    } catch (err) {
      alert('Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center gap-4">
          <Link 
            href="/sms-blast"
            className="w-10 h-10 rounded-xl border border-slate-200 dark:border-dark-border flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Buat SMS Blast</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Ikuti langkah mudah untuk mulai mengirim SMS massal.</p>
          </div>
        </div>

        {/* Form Component */}
        {isSubmitting ? (
          <div className="bg-white dark:bg-dark-card p-20 rounded-[2.5rem] border border-slate-200 dark:border-dark-border flex flex-col items-center justify-center gap-4">
            <Loader2 className="text-emerald-500 animate-spin" size={32} />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Menyimpan Kampanye SMS...</p>
          </div>
        ) : (
          <CreateCampaignForm 
            onCancel={() => router.push('/sms-blast')}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </AppLayout>
  );
}
