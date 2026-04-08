import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { ComparisonBarChart } from '@/components/charts/ComparisonBarChart';
import { DistributionChart } from '@/components/charts/DistributionChart';
import { 
  BarChart3, 
  TrendingUp, 
  MousePointer2, 
  CreditCard,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { getDashboardStats } from '@/app/actions/stats';

export default async function AnalyticsPage() {
  const statsData = await getDashboardStats();
  const stats = statsData?.summary || {
    totalSent: 0,
    waSuccess: 0,
    smsSuccess: 0,
    totalFailed: 0,
    countsByChannel: { WhatsApp: 0, SMS: 0 }
  };

  const channelData = {
    labels: ['WhatsApp Blast', 'SMS Blast', 'SMS LBA'],
    datasets: [
      {
        label: 'Terkirim',
        data: [stats.waSuccess, stats.smsSuccess, 0], 
        backgroundColor: '#10b981',
        borderRadius: 8,
      },
      {
        label: 'Gagal',
        data: [
          stats.countsByChannel.WhatsApp - stats.waSuccess, 
          stats.countsByChannel.SMS - stats.smsSuccess, 
          0
        ], 
        backgroundColor: '#e2e8f0',
        borderRadius: 8,
      }
    ]
  };

  const deliveryRate = stats.totalSent > 0 
    ? ((stats.totalSent / (stats.totalSent + stats.totalFailed)) * 100).toFixed(1) 
    : "0";

  // Mock calculation for spending
  const totalSpending = (stats.waSuccess * 275) + (stats.smsSuccess * 450);

  return (
    <AppLayout title="Analytics Overview">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Analytics Overview</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Pantau performa seluruh saluran komunikasi Anda secara terpusat.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-dark-border rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all">
              <Calendar size={18} />
              7 Hari Terakhir
            </button>
          </div>
        </div>

        {/* Efficiency Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard 
            title="Avg. Delivery Rate" 
            value={`${deliveryRate}%`} 
            change="+0.5%" 
            isTrendUp={true} 
            icon={TrendingUp} 
            variant="success"
          />
          <SummaryCard 
            title="Total Pesan" 
            value={stats.totalSent.toLocaleString('id-ID')} 
            change="+12%" 
            isTrendUp={true} 
            icon={BarChart3} 
            variant="primary"
          />
          <SummaryCard 
            title="Click-Through Rate" 
            value="4.8%" 
            change="-0.2%" 
            isTrendUp={false} 
            icon={MousePointer2} 
            variant="info"
          />
          <SummaryCard 
            title="Total Spending" 
            value={totalSpending.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })} 
            change="+8%" 
            isTrendUp={true} 
            icon={CreditCard} 
            variant="danger"
          />
        </div>


        {/* Global Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">Performa Per Saluran</h3>
                <p className="text-xs text-slate-500 mt-1">Komparasi volume pesan sukses vs gagal</p>
              </div>
            </div>
            <div className="h-[350px]">
              <ComparisonBarChart data={channelData} />
            </div>
          </div>

          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl p-6 shadow-sm flex flex-col">
            <div className="mb-6">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">Distribusi Saluran</h3>
              <p className="text-xs text-slate-500 mt-1">Berdasarkan volume pengiriman</p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="h-[250px] w-full">
                <DistributionChart data={statsData?.distribution} />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Metrics Table */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-dark-border">
            <h3 className="text-base font-bold text-slate-800 dark:text-white">Efisiensi Biaya Per Channel</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-dark-border">
                <tr>
                  <th className="px-6 py-4">Nama Channel</th>
                  <th className="px-6 py-4 text-right">Biaya/Pesan</th>
                  <th className="px-6 py-4 text-right">Total Biaya</th>
                  <th className="px-6 py-4 text-center">Trend Efisiensi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
                {[
                  { name: 'WhatsApp Blast', costPerMsg: 'Rp 275', total: (stats.waSuccess * 275).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }), trend: 'up', val: '+2%' },
                  { name: 'SMS Blast', costPerMsg: 'Rp 450', total: (stats.smsSuccess * 450).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }), trend: 'down', val: '-5%' },
                  { name: 'SMS LBA', costPerMsg: 'Rp 800', total: 'Rp 0', trend: 'up', val: '0%' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{row.name}</td>
                    <td className="px-6 py-4 text-right tabular-nums text-slate-500">{row.costPerMsg}</td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600 tabular-nums">{row.total}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        {row.trend === 'up' ? (
                          <ArrowUpRight className="text-rose-500" size={14} />
                        ) : (
                          <ArrowDownRight className="text-emerald-500" size={14} />
                        )}
                        <span className={row.trend === 'up' ? "text-rose-600" : "text-emerald-600"}>{row.val}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
