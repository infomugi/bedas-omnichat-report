"use client";

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  Users, 
  Plus, 
  Search, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  ExternalLink,
  Loader2,
  Database,
  UserPlus,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function ContactsPage() {
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLists = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contacts/lists');
      const data = await res.json();
      if (Array.isArray(data)) {
        setLists(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const filteredLists = lists.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout title="Database Kontak">
      <div className="space-y-8">
        {/* Header & Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Database Kontak</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Kelola daftar penerima pesan Anda dalam satu dashboard pusat.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-dark-border rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all">
              <FileText size={18} />
              Import CSV
            </button>
            <button className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-600/20">
              <Plus size={18} />
              Buat Grup Baru
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Total Grup", value: lists.length, icon: Database, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Total Kontak", value: lists.reduce((acc, curr) => acc + (curr.contacts_count?.[0]?.count || 0), 0), icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Aktif Hari Ini", value: "3", icon: UserPlus, color: "text-amber-600", bg: "bg-amber-50" },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", stat.bg)}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</p>
                <p className="text-xl font-bold text-slate-800 dark:text-white tabular-nums">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content: Table & Search */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-[2rem] shadow-sm overflow-hidden min-h-[400px]">
          <div className="p-6 border-b border-slate-100 dark:border-dark-border flex items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari nama grup..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-dark-border rounded-2xl text-sm focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-20 gap-4">
                <Loader2 className="text-emerald-500 animate-spin" size={32} />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sinkronisasi Database...</p>
              </div>
            ) : filteredLists.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-20 text-center opacity-40">
                <Database size={48} className="mb-4" />
                <p className="font-bold uppercase tracking-widest">Belum Ada Grup Kontak</p>
                <p className="text-xs mt-1">Buat grup pertama Anda untuk mulai mengirim pesan.</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-dark-border">
                  <tr>
                    <th className="px-8 py-5">Nama Grup</th>
                    <th className="px-8 py-5">Deskripsi</th>
                    <th className="px-8 py-5 text-right">Jumlah Kontak</th>
                    <th className="px-8 py-5 text-right">Dibuat</th>
                    <th className="px-8 py-5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-dark-border">
                  {filteredLists.map((list) => (
                    <tr key={list.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 dark:text-white capitalize">{list.name}</span>
                          <span className="text-[10px] text-emerald-600 font-bold uppercase mt-0.5 tracking-tighter">Verified List</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-slate-500 max-w-[200px] truncate">{list.description || '-'}</td>
                      <td className="px-8 py-6 text-right font-bold text-slate-700 dark:text-slate-300">
                        {list.contacts_count?.[0]?.count || 0}
                      </td>
                      <td className="px-8 py-6 text-right text-slate-500 text-xs">
                        {new Date(list.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link 
                            href={`/contacts/${list.id}`}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all"
                            title="Buka Grup"
                          >
                            <ExternalLink size={18} />
                          </Link>
                          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all">
                            <Edit3 size={18} />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
