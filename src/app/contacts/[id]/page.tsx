"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  Users, 
  ArrowLeft, 
  Search, 
  UserPlus, 
  Mail, 
  Phone, 
  Tag, 
  Loader2,
  Trash2,
  MoreVertical,
  CheckCircle2,
  Database
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Contact, ContactList } from '@/types/database';

export default function ContactsListPage() {
  const { id } = useParams();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [listInfo, setListInfo] = useState<ContactList | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    email: '',
    tags: ''
  });

  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      // 1. Fetch contacts
      const res = await fetch(`/api/contacts/${id}`);
      const data = await res.json();
      if (Array.isArray(data)) setContacts(data);

      // 2. Fetch list details from lists API
      const resLists = await fetch('/api/contacts/lists');
      const lists = await resLists.json();
      const current = lists.find((l: ContactList) => l.id === id);
      setListInfo(current);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.phone) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newContact,
          tags: newContact.tags.split(',').map(t => t.trim()).filter(Boolean)
        })
      });
      if (res.ok) {
        setIsModalOpen(false);
        setNewContact({ name: '', phone: '', email: '', tags: '' });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteContact = async (contactId: string, contactName: string) => {
    if (!confirm(`Hapus kontak "${contactName || 'Unknown'}"?`)) return;

    try {
      const res = await fetch(`/api/contacts/item/${contactId}`, { method: 'DELETE' });
      if (res.ok) {
        setContacts(prev => prev.filter(c => c.id !== contactId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredContacts = contacts.filter(c => 
    (c.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
     c.phone?.includes(searchQuery))
  );

  return (
    <AppLayout title={listInfo?.name || "Memuat Kontak..."}>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link 
              href="/contacts"
              className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-dark-border flex items-center justify-center text-slate-500 hover:text-emerald-600 transition-all hover:border-emerald-200 shadow-sm"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                {listInfo?.name || "Detail Grup"}
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest border border-emerald-100 dark:border-emerald-800/50">
                  {contacts.length} Kontak
                </span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {listInfo?.description || "Kelola data individual dalam grup ini."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-600/20"
            >
              <UserPlus size={18} />
              Tambah Kontak
            </button>
            <button className="p-2.5 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl text-slate-400 hover:text-slate-600 transition-all shadow-sm">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-[2rem] shadow-sm overflow-hidden min-h-[400px]">
          <div className="p-6 border-b border-slate-100 dark:border-dark-border flex items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari nama atau nomor telepon..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-dark-border rounded-2xl text-sm focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-emerald-50/50 dark:bg-emerald-900/10 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-800/20">
              <CheckCircle2 size={12} className="text-emerald-500" />
              Sinking with Supabase Realtime
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-20 gap-4">
                <Loader2 className="text-emerald-500 animate-spin" size={32} />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sinkronisasi Kontak...</p>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-20 text-center opacity-40">
                <Users size={48} className="mb-4" />
                <p className="font-bold uppercase tracking-widest">Grup Ini Masih Kosong</p>
                <p className="text-xs mt-1">Mulai tambahkan kontak manual atau melalui import CSV.</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-dark-border">
                  <tr>
                    <th className="px-8 py-5">Identitas Penerima</th>
                    <th className="px-8 py-5">WhatsApp / Phone</th>
                    <th className="px-8 py-5">Email Address</th>
                    <th className="px-8 py-5">Tags</th>
                    <th className="px-8 py-5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-dark-border">
                  {filteredContacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-xs shadow-inner">
                            {contact.name?.[0]?.toUpperCase() || '#'}
                          </div>
                          <span className="font-bold text-slate-800 dark:text-white capitalize">{contact.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium tabular-nums">
                          <Phone size={14} className="text-emerald-500" />
                          {contact.phone}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-slate-500">
                        {contact.email ? (
                          <div className="flex items-center gap-2">
                             <Mail size={14} />
                             {contact.email}
                          </div>
                        ) : '-'}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-wrap gap-1">
                          {contact.tags?.map((tag: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[9px] font-bold text-slate-500 rounded-md uppercase tracking-tighter">
                              {tag}
                            </span>
                          )) || '-'}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all shadow-sm">
                            <Edit3 className="size-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteContact(contact.id, contact.name)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all shadow-sm"
                          >
                            <Trash2 className="size-4" />
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

      {/* Modal Tambah Kontak */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)}></div>
          <div className="bg-white dark:bg-dark-card w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-dark-border relative p-10 overflow-hidden">
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6">Tambah Kontak Manual</h3>
            
            <form onSubmit={handleAddContact} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1 px-1">Nama Penerima</label>
                <input 
                  type="text" 
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-dark-border rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-200 transition-all font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1 px-1">Nomor Telepon/WA</label>
                <input 
                  type="text" 
                  value={newContact.phone}
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                  placeholder="Contoh: 628123456789"
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-dark-border rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-200 transition-all font-bold tracking-wider"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1 px-1">Email (Opsional)</label>
                <input 
                  type="email" 
                  value={newContact.email}
                  onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                  placeholder="budi@example.com"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-dark-border rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-200 transition-all font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">Tags (Pisahkan dengan koma)</label>
                <div className="relative">
                   <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                   <input 
                    type="text" 
                    value={newContact.tags}
                    onChange={(e) => setNewContact({...newContact, tags: e.target.value})}
                    placeholder="VIP, Customer, Promo"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-dark-border rounded-2xl text-xs outline-none focus:ring-2 focus:ring-emerald-200 transition-all font-bold uppercase tracking-widest"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 border border-slate-100 dark:border-dark-border text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-all text-sm"
                >
                  Batal
                </button>
                <button 
                   type="submit"
                   disabled={isSubmitting}
                   className="flex-1 py-3.5 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all text-sm flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Database size={18} />}
                  {isSubmitting ? 'Menympan...' : 'Simpan Kontak'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

const Edit3 = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
