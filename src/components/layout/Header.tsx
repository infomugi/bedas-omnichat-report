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
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { Notification } from '@/types/database';

export function Header({ title }: { title: string }) {
  const [isDark, setIsDark] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [balance, setBalance] = useState<number>(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const pathname = usePathname();

  // Simple breadcrumb logic
  const pathParts = pathname.split('/').filter(Boolean);

  useEffect(() => {
    const supabase = createClient();

    async function loadBalance() {
      const bal = await getBalance();
      setBalance(bal);
    }

    async function loadNotifications() {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
        
      setNotifications(data as Notification[] || []);
      const unread = (data as Notification[])?.filter(n => !n.is_read).length || 0;
      setUnreadCount(unread);
    }

    loadBalance();
    loadNotifications();

    const interval = setInterval(loadBalance, 30000);
    
    // Subscribe to notifications
    const channel = supabase
      .channel('header_notifications')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        () => loadNotifications()
      )
      .subscribe();

    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  const markAllAsRead = async () => {
    const supabase = createClient();
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('is_read', false);
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

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
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-full border border-slate-200 dark:border-dark-border flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all relative"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-dark-card animate-pulse"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setShowNotifications(false)}></div>
              <div className="absolute right-0 mt-4 w-80 bg-white dark:bg-dark-card rounded-3xl border border-slate-200 dark:border-dark-border shadow-2xl z-30 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="p-5 border-b border-slate-100 dark:border-dark-border flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 dark:text-white">Notifikasi</h4>
                  <button 
                    onClick={markAllAsRead}
                    className="text-[10px] font-bold text-emerald-600 uppercase hover:underline"
                  >
                    Tandai Dibaca
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 italic text-xs">
                      Tidak ada notifikasi saat ini.
                    </div>
                  ) : (
                    notifications.map((n, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "p-4 border-b border-slate-50 dark:border-dark-border/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-default",
                          !n.is_read && "bg-emerald-50/30 dark:bg-emerald-900/10"
                        )}
                      >
                        <div className="flex gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-inner",
                            n.type === 'campaign' ? "bg-blue-50 text-blue-500" : "bg-emerald-50 text-emerald-500"
                          )}>
                             <Bell size={14} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{n.title}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.body}</p>
                            <span className="text-[8px] text-slate-400 uppercase font-black tabular-nums mt-1 block">
                              {new Date(n.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <Link 
                   href="/system" 
                   onClick={() => setShowNotifications(false)}
                   className="block p-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50 dark:bg-slate-900/50 hover:text-slate-600 dark:hover:text-white transition-colors border-t border-slate-100 dark:border-dark-border"
                >
                  Lihat Semua Aktivitas
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="h-8 w-px bg-slate-200 dark:bg-dark-border"></div>

        {/* Credit Display */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">Sisa Kredit</span>
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-500 tracking-wide">
            {balance.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
          </span>
        </div>
      </div>
    </header>
  );
}
