import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { ActivityItem } from '@/components/dashboard/ActivityItem';
import { TrendChart } from '@/components/charts/TrendChart';
import { DistributionChart } from '@/components/charts/DistributionChart';
import { 
  MessageSquare, 
  MessageCircle, 
  AlertCircle,
  Database,
  Zap,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <AppLayout title="Ringkasan Dashboard">
      {/* Welcome Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-500 rounded-3xl p-8 text-white shadow-xl shadow-emerald-500/20">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Selamat Datang kembali, Admin! 👋</h2>
            <p className="text-emerald-50/80 text-sm max-w-md">Performa pengiriman pesan Anda meningkat 12% dibandingkan minggu lalu. Teruskan kinerja baik Anda!</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/whatsapp-blast" className="bg-white text-emerald-600 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-emerald-50 transition-all flex items-center gap-2">
                <MessageCircle size={18} /> Quick Blast WA
              </Link>
              <Link href="/sms-blast" className="bg-emerald-700/30 backdrop-blur-md text-white border border-emerald-400/30 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700/50 transition-all flex items-center gap-2">
                <MessageSquare size={18} /> Kirim SMS
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-40 h-40 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/20">
              <div className="text-center">
                <span className="block text-4xl font-black">98%</span>
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-70">Success Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard 
          title="Total Terkirim" 
          value="1.284.500" 
          change="+2.5%" 
          icon={Send} 
          variant="primary" 
        />
        <SummaryCard 
          title="WA Blast Sukses" 
          value="842.100" 
          change="-0.4%" 
          icon={MessageCircle} 
          variant="success" 
          isTrendUp={false}
        />
        <SummaryCard 
          title="SMS Blast Sukses" 
          value="435.400" 
          change="+4.1%" 
          icon={MessageSquare} 
          variant="info" 
        />
        <SummaryCard 
          title="Total Gagal" 
          value="7.042" 
          change="+0.1%" 
          icon={AlertCircle} 
          variant="danger" 
          isTrendUp={false}
        />
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 p-4 rounded-2xl flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest">API Server</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-500 font-medium tracking-tight">Status: Operational (99.9% Uptime)</p>
          </div>
          <Zap size={14} className="text-emerald-400" />
        </div>
        <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-4 rounded-2xl flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-blue-800 dark:text-blue-400 uppercase tracking-widest">WhatsApp Nodes</p>
            <p className="text-xs text-blue-600 dark:text-blue-500 font-medium tracking-tight">Active: 4/4 Instances Connected</p>
          </div>
          <ShieldCheck size={14} className="text-blue-400" />
        </div>
        <div className="bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 p-4 rounded-2xl flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-indigo-800 dark:text-indigo-400 uppercase tracking-widest">Database</p>
            <p className="text-xs text-indigo-600 dark:text-indigo-500 font-medium tracking-tight">Latency: 12ms (Optimized)</p>
          </div>
          <Database size={14} className="text-indigo-400" />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 dark:text-white">Tren Pengiriman (7 Hari Terakhir)</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="w-3 h-1 rounded-full bg-emerald-500"></span> WhatsApp
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="w-3 h-1 rounded-full bg-blue-500"></span> SMS
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            <TrendChart />
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-white mb-6">Distribusi Channel</h3>
          <div className="h-[200px] flex items-center justify-center">
            <DistributionChart />
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400"><MessageCircle size={14} className="text-emerald-500" /> WhatsApp</span>
              <span className="font-bold dark:text-white">65%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400"><MessageSquare size={14} className="text-blue-500" /> SMS Blast</span>
              <span className="font-bold dark:text-white">25%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400"><Send size={14} className="text-indigo-500" /> SMS LBA</span>
              <span className="font-bold dark:text-white">10%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Section */}
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-dark-border flex justify-between items-center">
          <h3 className="font-bold text-slate-800 dark:text-white">Aktivitas Terkini</h3>
          <Link href="/analytics" className="text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:underline flex items-center gap-1">
            Lihat Semua <ArrowRight size={12} />
          </Link>
        </div>
        <div className="divide-y divide-slate-50 dark:divide-dark-border">
          <ActivityItem 
            title='Kampanye "Promo Ramadhan" Selesai'
            subtitle="12.500 pesan terkirim via WhatsApp Blast"
            time="Baru Saja"
            status="SUKSES"
            statusVariant="success"
            icon={CheckCircle2}
          />
          <ActivityItem 
            title="Kirim SMS Blast ke 5.000 nomor"
            subtitle="Sedang dalam antrian (Queued)"
            time="2 menit lalu"
            status="PROSES"
            statusVariant="process"
            icon={Zap}
          />
          <ActivityItem 
            title="Sisa Kredit Menipis"
            subtitle="Saldo Anda di bawah Rp 500.000"
            time="1 jam lalu"
            status="WARNING"
            statusVariant="warning"
            icon={AlertTriangle}
          />
        </div>
      </div>
    </AppLayout>
  );
}
