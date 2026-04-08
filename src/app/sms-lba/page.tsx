"use client";

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  MapPin, 
  Search, 
  Crosshair, 
  Mail, 
  CheckCircle2, 
  Navigation,
  Radius,
  Layers,
  ChevronRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getBalance } from '@/app/actions/billing';
import { createCampaign } from '@/app/actions/campaigns';
import { useRouter } from 'next/navigation';

export default function SMSLBAPage() {
  const router = useRouter();
  const [radius, setRadius] = useState(1000);
  const [message, setMessage] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  React.useEffect(() => {
    async function fetchBalance() {
      const b = await getBalance();
      setBalance(b);
    }
    fetchBalance();
  }, []);

  const calculateEstimateRaw = (r: number) => {
    return Math.floor((r / 100) * 1500);
  };

  const calculateEstimate = (r: number) => {
    return calculateEstimateRaw(r).toLocaleString('id-ID');
  };

  const calculateCostRaw = (r: number) => {
    return calculateEstimateRaw(r) * 800;
  };

  const calculateCost = (r: number) => {
    return calculateCostRaw(r).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });
  };

  const handleSendLBA = async () => {
    if (!message) {
      setStatus({ type: 'error', msg: 'Harap masukkan isi pesan iklan.' });
      return;
    }

    setIsSending(true);
    setStatus(null);

    const est = calculateEstimateRaw(radius);
    
    const result = await createCampaign({
      name: `LBA Campaign - ${new Date().toLocaleDateString('id-ID')}`,
      type: 'SMS',
      sender: 'OMNICHAT',
      category: 'LBA',
      message: message,
      status: 'Sent',
      targetCount: est,
      successCount: est,
      failCount: 0,
      scheduledAt: new Date().toISOString()
    });

    if (result.success) {
      setStatus({ type: 'success', msg: 'Kampanye LBA berhasil dikirim!' });
      setMessage("");
      // Refresh balance
      const b = await getBalance();
      setBalance(b);
    } else {
      setStatus({ type: 'error', msg: result.error || 'Terjadi kesalahan saat mengirim LBA.' });
    }
    setIsSending(false);
  };

  const mapSize = 60 + ((radius - 100) / 4900) * (280 - 60);

  return (
    <AppLayout title="SMS LBA">
      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">SMS LBA (Location Based Advertising)</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Targetkan pengguna berdasarkan lokasi geografis real-time.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Sisa Kredit</span>
                <span className="text-sm font-bold text-emerald-600">
                  {balance !== null ? balance.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }) : '...'}
                </span>
            </div>
            <button 
              onClick={handleSendLBA}
              disabled={isSending}
              className={cn(
                "bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2",
                isSending && "opacity-50 cursor-not-allowed"
              )}
            >
                {isSending ? (
                  <RefreshCw className="animate-spin" size={18} />
                ) : (
                  <Navigation size={18} fill="currentColor" />
                )}
                {isSending ? "Mengirim..." : "Kirim LBA"}
            </button>
          </div>
        </div>

        {status && (
          <div className={cn(
            "p-4 rounded-2xl border flex items-center gap-3 transition-all animate-in fade-in slide-in-from-top-4",
            status.type === 'success' ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-rose-50 border-rose-100 text-rose-800"
          )}>
            {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-bold">{status.msg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Map & Location */}
            <div className="bg-white dark:bg-dark-card p-8 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm space-y-8">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-3 text-lg">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                            <MapPin size={20} />
                        </div>
                        Tentukan Area Target
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-dark-border">
                        <Layers size={12} />
                        Satellite View
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-1">Cari Lokasi / Gedung</label>
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <input 
                                type="text" 
                                placeholder="Misal: Mall Grand Indonesia, Jakarta" 
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-dark-border rounded-2xl text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-inner" 
                            />
                        </div>
                    </div>

                    <div className="h-80 rounded-3xl border border-slate-200 dark:border-dark-border relative overflow-hidden flex items-center justify-center bg-slate-200 dark:bg-slate-900 transition-all">
                        {/* Map Background Simulation */}
                        <div 
                            className="absolute inset-0 grayscale opacity-40 dark:opacity-20 pointer-events-none"
                            style={{ 
                                backgroundImage: `url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200')`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        ></div>
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                        {/* Visual Pulse Circle */}
                        <div 
                            className="rounded-full bg-indigo-500/10 border-2 border-indigo-500 flex items-center justify-center relative shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all duration-300 animate-pulse"
                            style={{ 
                                width: `${mapSize}px`,
                                height: `${mapSize}px`
                            }}
                        >
                            <div className="w-4 h-4 rounded-full bg-indigo-600 shadow-[0_0_15px_rgba(99,102,241,0.6)] ring-4 ring-white/30"></div>
                            {/* Marker Info */}
                            <div className="absolute -top-12 bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-2xl whitespace-nowrap flex items-center gap-2">
                                <Crosshair size={10} className="text-emerald-400" />
                                Lat: -6.2088, Lon: 106.8456
                            </div>
                        </div>

                        <button className="absolute bottom-6 right-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-xl border border-white dark:border-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2">
                            <Navigation size={14} /> Lock Current Point
                        </button>
                    </div>

                    <div className="space-y-4 pt-2">
                        <div className="flex justify-between items-center px-1">
                            <div className="flex items-center gap-2">
                                <Radius size={16} className="text-slate-400" />
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Radius Target Area</label>
                            </div>
                            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                                {radius >= 1000 ? (radius / 1000).toFixed(1) + " km" : radius + " m"}
                            </span>
                        </div>
                        <input 
                            type="range" 
                            min={100} 
                            max={5000} 
                            step={100} 
                            value={radius} 
                            onChange={(e) => setRadius(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase tracking-widest px-1">
                            <span>100 m</span>
                            <span>2.5 km</span>
                            <span>5 km</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Message Details */}
            <div className="space-y-8">
                <div className="bg-white dark:bg-dark-card p-8 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm space-y-6">
                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-3 text-lg">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                            <Mail size={20} />
                        </div>
                        Konten Iklan SMS
                    </h3>
                    
                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-1">Isi Pesan SMS LBA</label>
                            <textarea 
                                rows={6} 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Kunjungi booth kami di Grand Indonesia dan dapatkan voucher 50%!" 
                                className="w-full p-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-dark-border rounded-2xl text-sm focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none shadow-inner leading-relaxed"
                            ></textarea>
                            <div className="flex justify-between mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> SMS Masking Aktif</span>
                                <span>{message.length} / 160 Karakter</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-dark-border">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Estimasi Target</p>
                                <p className="text-base font-bold text-slate-800 dark:text-white">~{calculateEstimate(radius)} User</p>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/30">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Biaya Per Pesan</p>
                                <p className="text-base font-bold text-emerald-600">Rp 800</p>
                            </div>
                        </div>

                        <div className="p-5 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 flex items-start gap-4">
                            <CheckCircle2 size={22} className="text-indigo-600 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-xs font-bold text-indigo-800 dark:text-indigo-300">Estimasi Total Investasi</p>
                                <p className="text-xl font-bold text-indigo-900 dark:text-indigo-400 mt-1">{calculateCost(radius)}</p>
                                <p className="text-[10px] text-indigo-700/60 dark:text-indigo-400/60 mt-1">Biaya didasarkan pada jumlah target estimasi tertinggi.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Provider Support</p>
                    <div className="flex gap-3">
                         {['Telkomsel', 'Indosat', 'XL Axiata'].map((p, i) => (
                             <div key={i} className="flex-1 flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-dark-border group cursor-pointer hover:border-indigo-200 transition-all">
                                 <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{p}</span>
                                 <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-500" />
                             </div>
                         ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </AppLayout>
  );
}
