import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  variant?: 'primary' | 'success' | 'info' | 'danger';
  isTrendUp?: boolean;
}

export function SummaryCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  variant = 'primary',
  isTrendUp = true
}: SummaryCardProps) {
  const variants = {
    primary: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    success: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    info: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    danger: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400'
  };

  return (
    <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm hover:shadow-md transition-all group cursor-pointer">
      <div className="flex justify-between items-center mb-4">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", variants[variant])}>
          <Icon size={20} />
        </div>
        {change && (
          <span className={cn(
            "text-[10px] font-bold px-2 py-1 rounded-full",
            isTrendUp 
              ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" 
              : "text-rose-500 bg-rose-50 dark:bg-rose-900/20"
          )}>
            {change}
          </span>
        )}
      </div>
      <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{value}</h3>
    </div>
  );
}
