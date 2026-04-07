"use client";

import React, { useState, useEffect, useRef } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  Server, 
  Cpu, 
  Activity, 
  Terminal, 
  Zap, 
  ShieldAlert, 
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  ShieldCheck,
  Database,
  Cloud

} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogEntry {
  id: number;
  time: string;
  level: 'info' | 'success' | 'warn' | 'error';
  msg: string;
  source: string;
}

export default function SystemLogPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial Seed Logs
    const initialLogs: LogEntry[] = [
      { id: 1, time: '10:45:01', level: 'info', msg: 'System Kernel initialized. Version 5.2.1-stable.', source: 'KERNEL' },
      { id: 2, time: '10:45:10', level: 'success', msg: 'Connection established to Gateway SMS Provider #4.', source: 'GATEWAY' },
      { id: 3, time: '10:45:30', level: 'warn', msg: 'WhatsApp Node #02 reporting high memory usage (85%).', source: 'WA-POOL' },
      { id: 4, time: '10:46:02', level: 'error', msg: 'Failed authentication from IP 182.23.12.9 (Rejected).', source: 'AUTH' },
      { id: 5, time: '10:46:15', level: 'info', msg: 'Auto-scaling: Deploying new instance for WhatsApp-API-V2.', source: 'SCALER' },
    ];
    setLogs(initialLogs);

    // Event Cycle Simulation
    const interval = setInterval(() => {
        const levels: ('info' | 'success' | 'warn' | 'error')[] = ['info', 'success', 'success', 'warn'];
        const sources = ['DB-POOL', 'CRON', 'WA-API', 'SMS-GATEWAY', 'S3-BKP'];
        const messages = [
            'Syncing contact database with local cache...',
            'Heartbeat sent to orchestration layers.',
            'Routing balance check for user SES-8812.',
            'Routine audit log rotation completed.',
            'Backup snapshot taken for cluster OMNI-C1.'
        ];
        
        const newLog: LogEntry = {
            id: Date.now(),
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            level: levels[Math.floor(Math.random() * levels.length)],
            msg: messages[Math.floor(Math.random() * messages.length)],
            source: sources[Math.floor(Math.random() * sources.length)]
        };
        
        setLogs(prev => [...prev.slice(-49), newLog]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const metrics = [
    { title: 'Core API Server', sub: 'Main Gateway', val: '99.99%', status: 'ONLINE', icon: <Cloud size={20} />, color: 'emerald' },
    { title: 'WA Relay Pool', sub: '3 Active Nodes', val: 'Healthy', status: 'STABLE', icon: <Zap size={20} />, color: 'emerald' },
    { title: 'System Load', sub: 'Avg 5min', val: '12.5%', status: 'LOW', icon: <Cpu size={20} />, color: 'blue' },
    { title: 'Active Ingress', sub: 'Real-time Requests', val: '1.2k/s', status: 'HIGH', icon: <Activity size={20} />, color: 'indigo' }
  ];

  return (
    <AppLayout>
      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">System Monitoring & Logs</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Pantau kesehatan infrastruktur dan aktivitas sistem secara real-time.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all flex items-center gap-2">
                <RefreshCw size={14} className="text-slate-400" /> Refresh Data
            </button>
            <button className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/20 transition-all flex items-center gap-2">
                <XCircle size={14} /> Clear Console
            </button>
          </div>
        </div>

        {/* Health Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((m, i) => (
                <div key={i} className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm group hover:scale-[1.02] transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-inner",
                            m.color === 'emerald' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500" : 
                            m.color === 'blue' ? "bg-blue-50 dark:bg-blue-900/20 text-blue-500" : "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500"
                        )}>
                            {m.icon}
                        </div>
                        <span className={cn(
                             "px-2 py-0.5 text-[8px] font-black rounded uppercase tracking-widest",
                             m.status === 'ONLINE' || m.status === 'STABLE' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500" : "bg-slate-50 dark:bg-slate-900/20 text-slate-500"
                        )}>
                            {m.status}
                        </span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{m.title}</p>
                    <div className="flex items-baseline gap-2">
                        <h4 className="text-2xl font-black text-slate-800 dark:text-white tabular-nums">{m.val}</h4>
                        <span className="text-[10px] text-slate-400 font-medium">{m.sub}</span>
                    </div>
                </div>
            ))}
        </div>

        {/* Terminal Header & Tools */}
        <div className="bg-slate-900 dark:bg-black rounded-t-[2.5rem] border-x border-t border-slate-800 shadow-2xl overflow-hidden mt-8">
            <div className="px-8 py-5 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                    </div>
                    <div className="h-4 w-px bg-white/10 hidden md:block"></div>
                    <div className="flex items-center gap-2">
                        <Terminal size={14} className="text-slate-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Console Output — omnichat-audit-v4</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                        <input 
                            type="text" 
                            placeholder="Filter logs..." 
                            className="bg-black/40 border border-white/10 rounded-lg pl-8 pr-4 py-1.5 text-[10px] text-slate-400 outline-none focus:border-emerald-500/50 transition-all w-48"
                        />
                    </div>
                    <button className="p-2 text-slate-600 hover:text-white transition-colors">
                        <Filter size={16} />
                    </button>
                    <button className="p-2 text-slate-600 hover:text-white transition-colors">
                        <RefreshCw size={14} />
                    </button>
                </div>
            </div>
            
            {/* Terminal Body */}
            <div 
                ref={terminalRef}
                className="h-[500px] overflow-y-auto p-8 font-mono text-[11px] leading-relaxed scrollbar-thin scrollbar-thumb-slate-800"
                style={{ backgroundColor: '#020617' }}
            >
                {logs.map((log) => (
                    <div key={log.id} className="flex gap-4 group">
                        <span className="shrink-0 text-slate-600 select-none">{log.time}</span>
                        <span className={cn(
                            "shrink-0 font-bold uppercase tracking-tighter w-14",
                            log.level === 'info' ? "text-blue-400" : 
                            log.level === 'success' ? "text-emerald-400" : 
                            log.level === 'warn' ? "text-amber-400" : "text-rose-400"
                        )}>
                            [{log.level}]
                        </span>
                        <span className="shrink-0 text-slate-500 italic w-20">@{log.source}</span>
                        <span className={cn(
                             "text-slate-300",
                             log.level === 'error' && "font-bold text-rose-300"
                        )}>
                            {log.msg}
                        </span>
                    </div>
                ))}
                {/* Visual Cursor */}
                <div className="flex gap-4 mt-2">
                    <span className="text-slate-600">[{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                    <span className="bg-emerald-500/80 w-1.5 h-3.5 animate-pulse mt-0.5"></span>
                </div>
            </div>

            {/* Terminal Footer Info */}
            <div className="px-8 py-3 bg-slate-950 border-t border-white/5 flex items-center justify-between text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                <div className="flex gap-6">
                    <span className="flex items-center gap-1.5"><Database size={12} className="text-slate-700" /> DB Pool: 12/50 Active</span>
                    <span className="flex items-center gap-1.5"><Activity size={12} className="text-slate-700" /> Ingress: 42.1 MB/s</span>
                </div>
                <div className="flex gap-4">
                    <span className="text-emerald-500/50">Node: ID-WEST-01</span>
                    <span className="text-slate-800">Uptime: 14d 2h 41m</span>
                </div>
            </div>
        </div>

        {/* System Health Cards Bottom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-slate-200 dark:border-dark-border flex items-start gap-4 shadow-sm border-l-4 border-l-amber-500">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 flex items-center justify-center shrink-0">
                    <AlertTriangle size={24} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">Backup S3 Diperlukan</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">Backup snapshot terakhir diambil 72 jam yang lalu. Disarankan untuk memicu backup manual segera.</p>
                    <button className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-[0.2em] hover:underline">Jalankan Backup S3</button>
                </div>
            </div>
            <div className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-slate-200 dark:border-dark-border flex items-start gap-4 shadow-sm border-l-4 border-l-emerald-500">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center shrink-0">
                    <ShieldCheck size={24} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">Infrastruktur Aman</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">Seluruh node sistem beroperasi dalam parameter keamanan optimal. Tidak ditemukan anomali trafik.</p>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                        <CheckCircle2 size={12} /> Terverifikasi
                    </div>
                </div>
            </div>
        </div>
      </div>
    </AppLayout>
  );
}
