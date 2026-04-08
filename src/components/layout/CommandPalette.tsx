"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Command, 
  LayoutDashboard, 
  MessageSquare, 
  Plus, 
  BarChart2, 
  Smartphone, 
  CreditCard, 
  Settings, 
  Terminal,
  MapPin,
  Clock,
  User,
  Zap,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommandItem {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  category: 'Pages' | 'Actions' | 'Support';
  href?: string;
  onClick?: () => void;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  const commands: CommandItem[] = [
    { id: 'dash', title: 'Dashboard', desc: 'Go to main overview', category: 'Pages', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'wa-api', title: 'WhatsApp API', desc: 'Manage connections', category: 'Pages', href: '/whatsapp-api', icon: <Smartphone size={18} /> },
    { id: 'wa-blast', title: 'WhatsApp Blast', desc: 'Campaign list', category: 'Pages', href: '/whatsapp-blast', icon: <MessageSquare size={18} /> },
    { id: 'sms-blast', title: 'SMS Blast', desc: 'Direct messaging', category: 'Pages', href: '/sms-blast', icon: <Zap size={18} /> },
    { id: 'sms-lba', title: 'SMS LBA', desc: 'Location targeting', category: 'Pages', href: '/sms-lba', icon: <MapPin size={18} /> },
    { id: 'analytics', title: 'Analytics', desc: 'View reports', category: 'Pages', href: '/analytics', icon: <BarChart2 size={18} /> },
    { id: 'billing', title: 'Billing & Usage', desc: 'Top-up & Invoice', category: 'Pages', href: '/billing', icon: <CreditCard size={18} /> },
    { id: 'system', title: 'System Logs', desc: 'Server monitoring', category: 'Pages', href: '/system', icon: <Terminal size={18} /> },
    { id: 'settings', title: 'Settings', desc: 'User & API profile', category: 'Pages', href: '/settings', icon: <Settings size={18} /> },
    { id: 'new-wa', title: 'New WA Campaign', desc: 'Create WA blast', category: 'Actions', href: '/whatsapp-blast/new', icon: <Plus size={18} /> },
    { id: 'topup', title: 'Top-up Balance', desc: 'Add credits', category: 'Actions', href: '/billing', icon: <Plus size={18} /> },
    { id: 'profile', title: 'Edit Profile', desc: 'Update account', category: 'Support', href: '/settings', icon: <User size={18} /> },
  ];

  const filteredCommands = commands.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase()) || 
    c.desc.toLowerCase().includes(query.toLowerCase())
  );

  const toggle = useCallback(() => setIsOpen(open => !open), []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  const onSelect = (cmd: CommandItem) => {
    setIsOpen(false);
    setQuery("");
    if (cmd.href) router.push(cmd.href);
    if (cmd.onClick) cmd.onClick();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
        
        <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[1.5rem] shadow-[0_32px_64px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-slate-800 overflow-hidden relative animate-in fade-in zoom-in duration-200">
            {/* Search Bar */}
            <div className="flex items-center px-6 border-b border-slate-100 dark:border-slate-800 relative">
                <Search className="text-slate-400 shrink-0" size={20} />
                <input 
                    autoFocus
                    placeholder="Search anything... (Pages, Actions, Support)"
                    className="w-full pl-4 pr-4 py-6 bg-transparent outline-none text-slate-800 dark:text-slate-100 font-medium text-base placeholder:text-slate-400 transition-all"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
                />
                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-slate-400">ESC</span>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-h-[420px] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700">
                {filteredCommands.length > 0 ? (
                    <div className="space-y-4">
                        {['Pages', 'Actions', 'Support'].map(cat => {
                            const catItems = filteredCommands.filter(c => c.category === cat);
                            if (catItems.length === 0) return null;
                            
                            return (
                                <div key={cat} className="space-y-2">
                                    <p className="px-3 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">{cat}</p>
                                    <div className="space-y-1">
                                        {catItems.map((cmd) => (
                                            <button 
                                                key={cmd.id}
                                                onClick={() => onSelect(cmd)}
                                                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-emerald-900/10 group transition-all text-left relative"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 group-hover:text-emerald-600 transition-all">
                                                    {cmd.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{cmd.title}</p>
                                                    <p className="text-[11px] text-slate-400 font-medium">{cmd.desc}</p>
                                                </div>
                                                <ArrowRight size={14} className="text-slate-200 group-hover:text-emerald-500 group-hover:translate-x-1 opacity-0 group-hover:opacity-100 transition-all" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <Search size={32} />
                        </div>
                        <p className="text-sm font-bold text-slate-500">Tidak ada hasil ditemukan.</p>
                        <p className="text-[10px] text-slate-400 mt-1">Coba masukkan kata kunci yang berbeda.</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-sm">
                        <ArrowRight size={10} className="rotate-90 text-slate-500" />
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Enter to Select</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                         <span className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-sm text-[10px] font-bold text-slate-500 px-1.5">↑</span>
                         <span className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-sm text-[10px] font-bold text-slate-500 px-1.5">↓</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Navigate</span>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <Command size={12} className="text-slate-400" />
                    <span className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest italic">OmniChat UX Core</span>
                </div>
            </div>
        </div>
    </div>
  );
}
