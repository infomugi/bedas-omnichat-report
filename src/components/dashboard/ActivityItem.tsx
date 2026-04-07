import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ActivityItemProps {
  title: string;
  subtitle: string;
  time: string;
  status: string;
  statusVariant: 'success' | 'process' | 'warning';
  icon: LucideIcon;
}

export function ActivityItem({ 
  title, 
  subtitle, 
  time, 
  status, 
  statusVariant,
  icon: Icon 
}: ActivityItemProps) {
  const variants = {
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    process: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    warning: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400'
  };

  const iconVariants = {
    success: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-500',
    process: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-500',
    warning: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-500'
  };

  return (
    <div className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", iconVariants[statusVariant])}>
        <Icon size={16} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-bold text-slate-400 uppercase">{time}</p>
        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", variants[statusVariant])}>
          {status}
        </span>
      </div>
    </div>
  );
}
