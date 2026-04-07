"use client";

import React, { use } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ReportStats } from '@/components/campaigns/ReportStats';
import { TrendChart } from '@/components/charts/TrendChart';
import { ComparisonBarChart } from '@/components/charts/ComparisonBarChart';
import { mockCampaigns } from '@/lib/mock-data';
import { 
  ArrowLeft, 
  FileDown, 
  Calendar, 
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cn } from '@/lib/utils';


export default function CampaignReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const campaign = mockCampaigns.find(c => c.id === id);

  if (!campaign) {
    notFound();
  }

  // Sub-data for the report (Mock)
  const reportStats = {
    total: campaign.targetCount,
    success: campaign.successCount,
    failed: campaign.failCount,
    rate: campaign.targetCount > 0 ? Math.round((campaign.successCount / campaign.targetCount) * 100) : 0
  };

  const recipientLogs = [
    { id: 1, phone: '+6281234567890', status: 'Delivered', time: '10:01:22', name: 'Budi Santoso' },
    { id: 2, phone: '+6285712344321', status: 'Delivered', time: '10:01:45', name: 'Ani Wijaya' },
    { id: 3, phone: '+6281398765432', status: 'Failed', time: '10:02:10', name: 'Unknown', reason: 'Invalid Number' },
    { id: 4, phone: '+6281900011122', status: 'Delivered', time: '10:02:30', name: 'Eko Putra' },
    { id: 5, phone: '+6282133344455', status: 'Delivered', time: '10:03:00', name: 'Siti Aminah' },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/whatsapp-blast"
              className="w-10 h-10 rounded-xl border border-slate-200 dark:border-dark-border flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{campaign.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-500 dark:text-slate-400">ID: #{campaign.id}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{campaign.category}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="text-xs text-emerald-600 font-bold">{campaign.status.toUpperCase()}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-dark-border rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all shadow-sm">
              <Calendar size={18} />
              April 2026
            </button>
            <button className="flex items-center gap-2 px-6 py-2 bg-slate-800 dark:bg-emerald-600 hover:bg-slate-900 dark:hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg">
              <FileDown size={18} />
              Export Report
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <ReportStats stats={reportStats} />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">Tren Eksekusi Pesan</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Laju pengiriman kampanye secara real-time</p>
              </div>
            </div>
            <div className="h-[300px]">
              <TrendChart />
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">Komparasi Delivery</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Perbandingan Sukses vs Gagal</p>
            </div>
            <div className="h-[250px]">
              <ComparisonBarChart 
                data={{
                  labels: ['Success', 'Failed'],
                  datasets: [{
                    label: 'Pesan',
                    data: [campaign.successCount, campaign.failCount],
                    backgroundColor: ['#10b981', '#ef4444']
                  }]
                }} 
              />
            </div>
          </div>
        </div>

        {/* Recipients Table */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-dark-border flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">Log Penerima Terbaru</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Daftar 5 aktivitas pengiriman terakhir</p>
            </div>
            <button className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg transition-all">
              <MoreVertical size={20} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-dark-border">
                <tr>
                  <th className="px-6 py-4">Nama / Nomor</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Waktu</th>
                  <th className="px-6 py-4">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
                {recipientLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 dark:text-white">{log.name}</span>
                        <span className="text-xs text-slate-500">{log.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {log.status === 'Delivered' ? (
                          <CheckCircle2 className="text-emerald-500" size={14} />
                        ) : (
                          <XCircle className="text-rose-500" size={14} />
                        )}
                        <span className={cn(
                          "text-xs font-medium",
                          log.status === 'Delivered' ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"
                        )}>{log.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-500 tabular-nums">
                      <div className="flex items-center justify-end gap-1.5">
                        <Clock size={12} />
                        {log.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 italic">
                      {log.reason || 'Berhasil terkirim'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-dark-border flex justify-center">
            <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
              Lihat Seluruh Log Pengiriman
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
