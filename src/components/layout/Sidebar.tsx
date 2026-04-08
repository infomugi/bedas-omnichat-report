"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Send, 
  MessageCircle, 
  MapPin, 
  BarChart3, 
  FileBox, 
  Database, 
  Settings,
  ChevronRight,
  SendHorizontal,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getProfile } from '@/app/actions/profile';

const menuGroups = [
  {
    title: "Main Menu",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
      { name: "WhatsApp API", icon: MessageCircle, href: "/whatsapp-api" },
      { name: "WhatsApp Blast", icon: Send, href: "/whatsapp-blast" },
      { name: "SMS Blast", icon: MessageSquare, href: "/sms-blast" },
      { name: "SMS LBA", icon: MapPin, href: "/sms-lba" },
      { name: "Database Kontak", icon: Users, href: "/contacts" },
    ]
  },
  {
    title: "Analytics & Report",
    items: [
      { name: "Analytics", icon: BarChart3, href: "/analytics" },
      { name: "Tagihan & Usage", icon: FileBox, href: "/billing" },
    ]
  },
  {
    title: "System",
    items: [
      { name: "System Log", icon: Database, href: "/system" },
      { name: "Pengaturan", icon: Settings, href: "/settings" },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const [profile, setProfile] = React.useState<any>(null);

  React.useEffect(() => {
    async function loadProfile() {
      const data = await getProfile();
      setProfile(data);
    }
    loadProfile();
  }, []);

  return (
    <aside className="w-64 bg-white dark:bg-dark-card border-r border-slate-200 dark:border-dark-border flex flex-col h-full hidden md:flex shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 transition-all">
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-slate-100 dark:border-dark-border shrink-0">
        <div className="flex items-center gap-3 text-xl font-bold text-slate-800 dark:text-white">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
            <SendHorizontal size={18} />
          </div>
          <span>Omni<span className="text-emerald-600">Chat</span></span>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              {group.title}
            </p>
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                    isActive 
                      ? "text-emerald-700 bg-emerald-50 shadow-sm border border-emerald-100/50 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400"
                  )}
                >
                  <item.icon 
                    size={20} 
                    className={cn(
                      "shrink-0",
                      isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-600"
                    )} 
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User Mini Profile */}
      <div className="p-4 border-t border-slate-100 dark:border-dark-border">
        <Link href="/settings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-all">
          <img 
            src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.full_name || 'User'}&background=10b981&color=fff&rounded=true&bold=true`} 
            alt="Profile" 
            className="w-9 h-9 rounded-full shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{profile?.full_name || 'Loading...'}</p>
            <p className="text-xs text-slate-500 truncate lowercase">{profile?.email || '...'}</p>
          </div>
          <ChevronRight size={14} className="text-slate-400" />
        </Link>
      </div>
    </aside>
  );
}
