"use client";

import React, { useEffect, useState } from 'react';
import { 
  Bell, 
  Moon, 
  Sun,
  Search
} from 'lucide-react';

export function Header({ title }: { title: string }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
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
    <header className="h-20 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md border-b border-slate-200 dark:border-dark-border flex items-center justify-between px-8 shrink-0 z-0 transition-colors">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Pantau seluruh kanal komunikasi Anda dalam satu tampilan.</p>
      </div>
      
      <div className="flex items-center gap-4">
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
