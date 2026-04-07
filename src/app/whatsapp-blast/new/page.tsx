"use client";

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CreateCampaignForm } from '@/components/campaigns/CreateCampaignForm';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewWhatsAppBlastPage() {
  const router = useRouter();

  const handleSubmit = (data: any) => {
    console.log('Sending Campaign Data:', data);
    alert('Kampanye WhatsApp Blast berhasil dibuat dan dijadwalkan!');
    router.push('/whatsapp-blast');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center gap-4">
          <Link 
            href="/whatsapp-blast"
            className="w-10 h-10 rounded-xl border border-slate-200 dark:border-dark-border flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Buat WhatsApp Blast</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Ikuti langkah mudah untuk mulai menyebarkan pesan Anda.</p>
          </div>
        </div>

        {/* Form Component */}
        <CreateCampaignForm 
          onCancel={() => router.push('/whatsapp-blast')}
          onSubmit={handleSubmit}
        />
      </div>
    </AppLayout>
  );
}
