"use client";

import React from 'react';
import { Campaign } from '@/types/campaign';
import { cn } from '@/lib/utils';
import { 
  MoreVertical, 
  Search, 
  Trash2, 
  Edit3, 
  Eye,
  FileText
} from 'lucide-react';
import Link from 'next/link';

interface CampaignTableProps {
  campaigns: Campaign[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
}

export function CampaignTable({ campaigns, onDelete, onEdit, onView }: CampaignTableProps) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Sent': return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-800/50';
      case 'Queued': return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/40 dark:text-blue-400 dark:border-blue-800/50';
      case 'Draft': return 'bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
      case 'Error': return 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/40 dark:text-rose-400 dark:border-rose-800/50';
      default: return 'bg-slate-50 text-slate-700';
    }
  };

  return (
    <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl shadow-sm overflow-hidden transition-all">
      <div className="p-4 md:p-6 border-b border-slate-100 dark:border-dark-border flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Cari kampanye..." 
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-dark-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-900/30 transition-all"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-dark-border">
            <tr>
              <th className="px-6 py-4">Informasi Kampanye</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Target</th>
              <th className="px-6 py-4 text-right">Terkirim</th>
              <th className="px-6 py-4 text-right">Dibuat Pada</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 dark:text-white">{campaign.name}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{campaign.sender}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-bold border",
                    getStatusStyle(campaign.status)
                  )}>
                    {campaign.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400">
                  {campaign.targetCount.toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4 text-right font-bold text-emerald-600 dark:text-emerald-500">
                  {campaign.successCount.toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4 text-right text-slate-500 dark:text-slate-500 text-xs">
                  {new Date(campaign.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link 
                      href={`/whatsapp-blast/${campaign.id}`}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all"
                      title="Lihat Detail"
                    >
                      <Eye size={16} />
                    </Link>
                    <button 
                      onClick={() => onEdit?.(campaign.id)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete?.(campaign.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
