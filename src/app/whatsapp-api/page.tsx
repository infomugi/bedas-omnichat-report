"use client";

import React, { useState, useEffect, useRef } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  QrCode, 
  Trash2, 
  Power, 
  Send, 
  Smartphone, 
  Wifi, 
  BatteryFull,
  Terminal,
  X,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function WhatsAppAPIPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logs, setLogs] = useState<{ time: string, msg: string, type: 'info' | 'error' | 'success' | 'sys' }[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial logs
    setLogs([
      { time: '09:42:11', msg: '[SYSTEM] Initializing WhatsApp instance v3.2.1...', type: 'success' },
      { time: '09:42:12', msg: '[SYSTEM] Loading session: SES-82193...', type: 'info' },
      { time: '09:42:15', msg: '[ERROR] Session credentials invalid or expired.', type: 'error' },
      { time: '09:42:16', msg: '[SYSTEM] Waiting for QR scan interaction...', type: 'info' },
    ]);

    // Simulated logs interval
    const interval = setInterval(() => {
      const messages = [
        '[SYSTEM] Keep-alive heartbeat sent to core gateway.',
        '[SYSTEM] RAM Usage: 124MB | Active Threads: 4',
        '[POLL] Checking for pending background outgoing messages...',
        '[SYSTEM] DB Connection pool stable (Active: 12/20)'
      ];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      addLog(randomMsg, 'sys');
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (msg: string, type: 'info' | 'error' | 'success' | 'sys' = 'info') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [...prev, { time: timeStr, msg, type }]);
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">WhatsApp API Integration</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sambungkan akun WhatsApp Anda untuk memulai blast.</p>
          </div>
          <div className="flex items-center gap-3">
             <span className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-[10px] font-bold rounded-full border border-rose-100 dark:border-rose-900/50 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span> Disconnected
            </span>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Sisa Kredit</span>
              <span className="text-sm font-bold text-emerald-600">Rp 2.450.000</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Connection Card */}
          <div className="bg-white dark:bg-dark-card rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 pb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Hubungkan Perangkat</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Buka aplikasi WhatsApp di HP Anda, buka Menu/Setelan {'>'} Perangkat Tertaut {'>'} Tautkan Perangkat, lalu arahkan HP ke kode di bawah.
              </p>
            </div>
            
            <div className="flex-1 p-8 flex flex-col items-center justify-center">
              <button 
                onClick={() => { setIsModalOpen(true); addLog("[ACTION] QR Modal requested. Generating unique pairing key...", "success"); }}
                className="w-64 h-64 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-4 border-dashed border-slate-200 dark:border-dark-border flex items-center justify-center group relative overflow-hidden transition-all hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer"
              >
                <div className="text-center z-10 p-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-slate-100 dark:border-dark-border group-hover:scale-105 transition-transform">
                  <QrCode className="text-emerald-500 mx-auto mb-3" size={48} />
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-tight">
                    Klik untuk generate<br/>kode QR baru
                  </p>
                </div>
                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              
              <div className="mt-8 grid grid-cols-3 gap-4 w-full">
                <div className="text-center border-r border-slate-100 dark:border-dark-border">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Status</p>
                  <p className="text-sm font-bold text-rose-500">Idle</p>
                </div>
                <div className="text-center border-r border-slate-100 dark:border-dark-border">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Session ID</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">SES-82193</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Latency</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">-- ms</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-dark-border flex flex-wrap gap-3">
              <button className="flex-1 bg-rose-50 dark:bg-rose-900/10 hover:bg-rose-100 dark:hover:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-xs font-bold py-3 rounded-xl transition-all border border-rose-200 dark:border-rose-900/30 flex items-center justify-center gap-2">
                <Trash2 size={16} /> Reset Session
              </button>
              <button className="flex-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold py-3 rounded-xl transition-all border border-slate-200 dark:border-slate-600 flex items-center justify-center gap-2">
                <Power size={16} /> Disconnect
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {/* Test Message Form */}
            <div className="bg-white dark:bg-dark-card rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm p-8">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Test Pengiriman Pesan</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Nomor WhatsApp Tujuan</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-400 text-sm font-bold">+62</span>
                    </div>
                    <input 
                      type="text" 
                      placeholder="8123456789" 
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-dark-border rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-200 outline-none transition-all" 
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">Gunakan format internasional tanpa angka 0 di depan.</p>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Isi Pesan Test</label>
                  <textarea 
                    rows={4} 
                    placeholder="Halo! Ini adalah pesan percobaan dari platform OmniChat." 
                    className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-dark-border rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <button 
                  onClick={() => addLog("[TEST] Outgoing message request submitted...", "info")}
                  className="w-full bg-slate-800 dark:bg-emerald-600 hover:bg-slate-900 dark:hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg dark:shadow-emerald-900/20"
                >
                  Kirim Pesan Sekarang
                  <Send size={16} className="text-slate-400 dark:text-emerald-200 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Device Info Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Smartphone size={120} />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest opacity-60 mb-6">Informasi Perangkat</h3>
              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <p className="text-xs opacity-60">Nama Perangkat</p>
                    <p className="text-sm font-bold">-- (Not Connected)</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">
                    <Wifi size={20} />
                  </div>
                  <div>
                    <p className="text-xs opacity-60">Status Koneksi</p>
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        <p className="text-sm font-bold text-rose-400">Offline</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">
                    <BatteryFull size={20} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs opacity-60">Baterai HP</p>
                    <p className="text-sm font-bold">-- %</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Console / Terminal Section */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden mt-8">
            <div className="px-6 py-4 bg-slate-800/50 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                        <Terminal size={14} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Console Output - System Logs</span>
                    </div>
                </div>
                <button className="text-slate-500 hover:text-white transition-colors">
                    <X size={16} />
                </button>
            </div>
            <div ref={terminalRef} className="p-6 h-64 overflow-y-auto font-mono text-[11px] space-y-2 border-t border-white/5 scrollbar-thin scrollbar-thumb-slate-700">
                {logs.map((log, i) => (
                  <div key={i} className={cn(
                    "flex gap-4",
                    log.type === 'error' ? "text-rose-400" : 
                    log.type === 'success' ? "text-emerald-400" : 
                    log.type === 'sys' ? "text-slate-500italics" : "text-slate-400"
                  )}>
                    <span className="opacity-50 shrink-0">{log.time}</span>
                    <span>{log.msg}</span>
                  </div>
                ))}
            </div>
        </div>
      </div>

      {/* QR Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white dark:bg-dark-card w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-dark-border overflow-hidden relative">
            <button 
              onClick={() => { setIsModalOpen(false); addLog("[ACTION] QR Modal closed by user.", "info"); }} 
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X size={24} />
            </button>
            <div className="p-8 text-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Scan QR Code</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-8 px-6">
                Buka WhatsApp {'>'} Perangkat Tertaut {'>'} Tautkan Perangkat. Scan kode di bawah untuk menghubungkan.
              </p>
              
              <div className="mx-auto w-64 h-64 bg-white p-4 rounded-2xl shadow-inner border border-slate-100 relative group overflow-hidden">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=OmniChat+Mock+Session" 
                  alt="QR Code" 
                  className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-slate-800/60 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-emerald-600 text-white text-[10px] font-bold px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
                        <RefreshCw size={14} /> Refresh QR
                    </button>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 text-rose-500">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Waiting for scan...</span>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 flex items-center justify-center gap-3 border-t border-slate-100 dark:border-dark-border">
              <AlertCircle size={14} className="text-slate-400" />
              <p className="text-[10px] text-slate-400 text-center font-medium italic">
                Kode QR diperbarui setiap 20 detik secara otomatis.
              </p>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
