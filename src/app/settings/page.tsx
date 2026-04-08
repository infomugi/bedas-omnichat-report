"use client";

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  UserCircle, 
  Key, 
  ShieldCheck, 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  Eye, 
  EyeOff,
  Bell,
  Save,
  ChevronRight,
  Globe,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getProfile, updateProfile } from '@/app/actions/profile';

export default function SettingsPage() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const data = await getProfile();
      setProfile(data);
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const res = await updateProfile({
      full_name: profile.full_name,
      username: profile.username
    });
    setSaving(false);
    if (res.success) {
      alert('Profil berhasil diperbarui!');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-4xl mx-auto pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Pengaturan Aplikasi</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Konfigurasi profil, manajemen user, dan integrasi API.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
          >
            <Save size={18} /> {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>

        <div className="space-y-8">
          {/* Profile Section */}
          <div className="bg-white dark:bg-dark-card p-8 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-white mb-8 flex items-center gap-3 text-lg">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <UserCircle size={22} />
                </div>
                Profil Pengguna
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center gap-6 md:col-span-2 mb-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-dark-border">
                  <img src="https://ui-avatars.com/api/?name=Admin+User&background=10b981&color=fff&rounded=true&bold=true" className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-800 shadow-xl" alt="Profile" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-2">Foto Profil</h4>
                    <div className="flex items-center gap-2">
                        <button className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg hover:shadow-md transition-all border border-slate-100 dark:border-dark-border">Ganti Foto</button>
                        <button className="text-[10px] font-bold text-rose-500 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg hover:shadow-md transition-all border border-slate-100 dark:border-dark-border">Hapus</button>
                    </div>
                  </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 px-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={profile?.full_name || ''} 
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-dark-border rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all dark:text-slate-200" 
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 px-1">Alamat Email</label>
                <input 
                  type="email" 
                  value={profile?.email || ''} 
                  disabled
                  className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900/10 border border-slate-200 dark:border-dark-border rounded-xl text-sm font-medium outline-none transition-all dark:text-slate-400 cursor-not-allowed" 
                />
              </div>
            </div>
          </div>

          {/* API & Keys Section */}
          <div className="bg-white dark:bg-dark-card p-8 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-white mb-8 flex items-center gap-3 text-lg">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Key size={22} />
                </div>
                Integrasi & API Keys
            </h3>

            <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-dark-border relative group overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                             <span className="text-xs font-bold text-slate-800 dark:text-slate-300">OmniChat Secret Key</span>
                             <span className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-[8px] font-black rounded uppercase">Active</span>
                        </div>
                        <button className="text-[10px] font-bold text-rose-500 dark:text-rose-400 opacity-60 hover:opacity-100 transition-opacity">Revoke Key</button>
                    </div>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                             <input 
                                type={showApiKey ? "text" : "password"} 
                                readOnly 
                                value="API_KEY_PLACEHOLDER_FOR_DEMO" 
                                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] font-mono text-slate-500 dark:text-slate-400 outline-none shadow-sm" 
                            />
                            <button 
                                onClick={() => setShowApiKey(!showApiKey)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        <button 
                            onClick={() => copyToClipboard("API_KEY_PLACEHOLDER_FOR_DEMO")}
                            className="px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all flex items-center justify-center shadow-sm"
                        >
                            {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} className="text-slate-400" />}
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-3 italic px-1">Jangan bagikan Secret Key Anda kepada siapapun. Gunakan key ini untuk mengakses API kami.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/30 border border-slate-100 dark:border-dark-border flex items-center justify-between group cursor-pointer hover:border-emerald-500 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-500 flex items-center justify-center">
                                <Globe size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Webhook URL</p>
                                <p className="text-[10px] text-slate-400">1 endpoint active</p>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                     </div>
                     <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/30 border border-slate-100 dark:border-dark-border flex items-center justify-between group cursor-pointer hover:border-emerald-500 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center">
                                <Bell size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Push Notifications</p>
                                <p className="text-[10px] text-slate-400">FireBase (FCM) Linked</p>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                     </div>
                </div>
            </div>
          </div>

          {/* User Management Section */}
          <div className="bg-white dark:bg-dark-card p-8 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm">
            <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-3 text-lg">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-400 flex items-center justify-center">
                        <ShieldCheck size={22} />
                    </div>
                    Manajemen Akses User
                </h3>
                <button className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl flex items-center gap-2 hover:shadow-md transition-all border border-emerald-100/50 dark:border-emerald-900/50">
                    <Plus size={14} /> Tambah Staff
                </button>
            </div>

            <div className="overflow-x-auto -mx-8">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900/30 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-dark-border">
                            <th className="px-8 py-3">Nama Lengkap</th>
                            <th className="px-8 py-3">Role</th>
                            <th className="px-8 py-3">Status</th>
                            <th className="px-8 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-dark-border">
                        {[
                            { name: 'Admin Utama', role: 'Super Admin', status: 'ACTIVE', color: 'emerald' },
                            { name: 'Budi Operator', role: 'Operator', status: 'INVITED', color: 'orange' },
                            { name: 'Siti Marketing', role: 'Content Manager', status: 'ACTIVE', color: 'emerald' }
                        ].map((user, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                                <td className="px-8 py-4 font-bold text-slate-700 dark:text-slate-300 text-sm">{user.name}</td>
                                <td className="px-8 py-4 text-xs italic text-slate-400 font-medium">{user.role}</td>
                                <td className="px-8 py-4">
                                    <span className={cn(
                                        "px-2 py-0.5 text-[8px] font-black rounded uppercase tracking-wider",
                                        user.status === 'ACTIVE' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500" : "bg-orange-50 dark:bg-orange-900/20 text-orange-500"
                                    )}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-8 py-4 text-right space-x-2">
                                     <button className="p-2 text-slate-300 hover:text-emerald-500 transition-colors"><ShieldCheck size={16} /></button>
                                     <button className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>

          {/* Security Alert */}
          <div className="bg-rose-50 dark:bg-rose-900/10 p-6 rounded-3xl border border-rose-100 dark:border-rose-900/30 flex items-start gap-4">
               <div className="w-12 h-12 rounded-2xl bg-white dark:bg-rose-900/50 flex items-center justify-center text-rose-500 shrink-0 border border-rose-100/50 dark:border-rose-900/50 shadow-sm">
                    <Lock size={24} />
               </div>
               <div>
                   <h4 className="text-sm font-bold text-rose-900 dark:text-rose-300 mb-1">Ganti Password Secara Berkala</h4>
                   <p className="text-xs text-rose-700/60 dark:text-rose-400/60 leading-relaxed">Keamanan akun Anda adalah prioritas kami. Terakhir kali password Anda diganti adalah 45 hari yang lalu. Pastikan menggunakan kombinasi simbol dan angka.</p>
                   <button className="mt-3 text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest hover:underline transition-all">Ganti Password Sekarang</button>
               </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
