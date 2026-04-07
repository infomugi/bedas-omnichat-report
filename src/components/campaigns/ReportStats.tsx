"use client";

import React from 'react';
import { 
  CheckCheck, 
  UserX, 
  Target, 
  Percent 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReportStatsProps {
  stats: {
    total: number;
    success: number;
    failed: number;
    rate: number;
  };
}

export function ReportStats({ stats }: ReportStatsProps) {
  const cards = [
    {
      label: 'Total Target',
      value: stats.total.toLocaleString('id-ID'),
      icon: Target,
      color: 'bg-indigo-50 text-indigo-600',
      darkColor: 'dark:bg-indigo-900/20 dark:text-indigo-400'
    },
    {
      label: 'Terkirim (Sukses)',
      value: stats.success.toLocaleString('id-ID'),
      icon: CheckCheck,
      color: 'bg-emerald-50 text-emerald-600',
      darkColor: 'dark:bg-emerald-900/20 dark:text-emerald-400'
    },
    {
      label: 'Gagal / Invalid',
      value: stats.failed.toLocaleString('id-ID'),
      icon: UserX,
      color: 'bg-rose-50 text-rose-500',
      darkColor: 'dark:bg-rose-900/20 dark:text-rose-400'
    },
    {
      label: 'Delivery Rate',
      value: `${stats.rate}%`,
      icon: Percent,
      color: 'bg-blue-50 text-blue-600',
      darkColor: 'dark:bg-blue-900/20 dark:text-blue-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {cards.map((card, index) => (
        <div 
          key={index} 
          className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">{card.label}</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">{card.value}</h3>
            </div>
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center text-lg group-hover:scale-110 transition-transform",
              card.color,
              card.darkColor
            )}>
              <card.icon size={20} />
            </div>
          </div>
          {card.label === 'Delivery Rate' && (
            <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-1000" 
                style={{ width: `${stats.rate}%` }}
              ></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
