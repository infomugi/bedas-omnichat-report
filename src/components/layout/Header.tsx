"use client";

import React, { useEffect, useState } from 'react';
import { 
  Bell, 
  Moon, 
  Sun,
  Search,
  ChevronRight,
  Command
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getBalance } from '@/app/actions/billing';

export function Header({ title }: { title: string }) {
  const [isDark, setIsDark] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const pathname = usePathname();

  // Simple breadcrumb logic
  const pathParts = pathname.split('/').filter(Boolean);

  useEffect(() => {
    async function loadBalance() {
      const bal = await getBalance();
      setBalance(bal);
    }
    loadBalance();

    const interval = setInterval(loadBalance, 30000);
    
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }

    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <header className="h-20 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md border-b border-slate-200 dark:border-dark-border flex items-center justify-between px-8 shrink-0 z-10 transition-colors">
      <div className="flex flex-col">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
            <span className="hover:text-emerald-500 cursor-pointer transition-colors">OmniChat</span>
            {pathParts.map((part, i) => (
                <React.Fragment key={i}>
                    <ChevronRight size={10} className="text-slate-300 dark:text-slate-700" />
                    <span className={cn(
                        "transition-colors",
                        i === pathParts.length - 1 ? "text-emerald-600 dark:text-emerald-500" : "hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                    )}>
                        {part.replace(/-/g, ' ')}
                    </span>
                </React.Fragment>
            ))}
        </div>
        <h1 className="text-xl font-black text-slate-800 dark:text-white leading-none">{title}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Command Palette Trigger Hint */}
        <button 
            className="hidden lg:flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-dark-border rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all group mr-2"
            onClick={() => {
                const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
                document.dispatchEvent(event);
            }}
        >
            <Search size={16} className="group-hover:text-emerald-500 transition-colors" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Quick Search...</span>
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 shadow-sm">
                <Command size={10} />
                <span className="text-[9px] font-black">K</span>
            </div>
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full border border-slate-200 dark:border-dark-border flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button className="w-10 h-10 rounded-full border border-slate-200 dark:border-dark-border flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all relative">
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-dark-card"></span>
        </button>

        <div className="h-8 w-px bg-slate-200 dark:bg-dark-border"></div>

        {/* Credit Display */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">Sisa Kredit</span>
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-500 tracking-wide">Rp 2.450.000</span>
        </div>
      </div>
    </header>
  );
}
