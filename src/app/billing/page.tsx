"use client";

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  Plus, 
  MessageSquare, 
  Search, 
  ChevronRight, 
  FileText, 
  CreditCard, 
  QrCode, 
  Building2, 
  Clock, 
  X,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BillingPage() {
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const transactions = [
    { id: 'TRX-9210', date: '05 Apr 2026', desc: 'Top-up Saldo via Bank Transfer', type: 'in', channel: 'SMS', status: 'COMPLETED', amount: 1000000 },
    { id: 'TRX-8102', date: '02 Apr 2026', desc: 'Pemakaian Campaign "Promo Ramadhan"', type: 'out', channel: 'SMS', status: 'USED', amount: -450000 },
    { id: 'TRX-7291', date: '28 Mar 2026', desc: 'Monthly Subscription Fee', type: 'out', channel: 'SYSTEM', status: 'COMPLETED', amount: -250000 },
    { id: 'TRX-6112', date: '25 Mar 2026', desc: 'Top-up Saldo via QRIS', type: 'in', channel: 'SMS', status: 'COMPLETED', amount: 500000 },
  ];

  return (
    <AppLayout>
      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Tagihan & Usage</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Kelola saldo kredit, riwayat transaksi, dan tagihan Anda.</p>
          </div>
          <button 
            onClick={() => { setIsTopupModalOpen(true); setStep(1); }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
          >
            <Plus size={18} /> Top-up Saldo
          </button>
        </div>

        {/* Credit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* WhatsApp Credit */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl p-8 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-2">WhatsApp Account Type</p>
              <h3 className="text-4xl font-black mb-1">PRO-LICENSE</h3>
              <div className="flex items-center gap-2 mt-4">
                <div className="w-1.5 h-1.5 rounded-full bg-white opacity-40"></div>
                <p className="text-xs font-medium opacity-80">Unlimited Messages</p>
              </div>
              <p className="text-[10px] font-bold mt-2 opacity-50 uppercase tracking-tighter">Expires on: Dec 31, 2026</p>
            </div>
            <div className="absolute right-0 bottom-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <MessageSquare size={120} />
            </div>
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          {/* SMS Credit */}
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-2">SMS Credit Balance</p>
              <h3 className="text-4xl font-black mb-1">Rp 2.450.000</h3>
              <div className="flex items-center gap-2 mt-4">
                <div className="w-1.5 h-1.5 rounded-full bg-white opacity-40"></div>
                <p className="text-xs font-medium opacity-80">Estimasi: ~5.444 SMS</p>
              </div>
              <p className="text-[10px] font-bold mt-2 opacity-50 uppercase tracking-tighter">Per SMS: Rp 450 (Standard)</p>
            </div>
            <div className="absolute right-0 bottom-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <CreditCard size={120} />
            </div>
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Transaction History Table */}
        <div className="bg-white dark:bg-dark-card rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 dark:border-dark-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">Riwayat Transaksi & Top-up</h3>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Cari ID transaksi..." 
                  className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-dark-border rounded-xl text-[11px] font-medium outline-none w-full" 
                />
              </div>
              <input 
                type="month" 
                className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-dark-border p-2 rounded-xl text-[11px] font-medium outline-none dark:text-slate-200" 
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/30 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-dark-border">
                  <th className="px-8 py-4">Tanggal</th>
                  <th className="px-8 py-4">Deskripsi</th>
                  <th className="px-8 py-4 text-center">Tipe</th>
                  <th className="px-8 py-4">Channel</th>
                  <th className="px-8 py-4 text-right">Nominal</th>
                  <th className="px-8 py-4 text-center">Status</th>
                  <th className="px-8 py-4 text-center">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-dark-border">
                {transactions.map((tx, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                    <td className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tabular-nums">{tx.date}</td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{tx.desc}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{tx.id}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className={cn(
                        "w-8 h-8 rounded-lg mx-auto flex items-center justify-center",
                        tx.type === 'in' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500" : "bg-rose-50 dark:bg-rose-900/20 text-rose-500"
                      )}>
                        {tx.type === 'in' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-900 text-[10px] font-bold text-slate-500 dark:text-slate-400 rounded-md border border-slate-200/50 dark:border-slate-800 uppercase tracking-tighter">{tx.channel}</span>
                    </td>
                    <td className={cn(
                      "px-8 py-5 text-right font-black tabular-nums",
                      tx.type === 'in' ? "text-emerald-500" : "text-rose-500"
                    )}>
                      {tx.type === 'in' ? "+" : ""}{tx.amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center">
                        <span className={cn(
                          "px-2 py-1 text-[9px] font-black rounded-md tracking-widest",
                          tx.status === 'COMPLETED' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                        )}>
                          {tx.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <button className="p-2 text-slate-300 hover:text-emerald-500 transition-colors">
                        <FileText size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 bg-slate-50/50 dark:bg-slate-900/30 text-center border-t border-slate-100 dark:border-dark-border">
            <button className="text-[11px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors">
              Muat Lebih Banyak Transaksi
            </button>
          </div>
        </div>
      </div>

      {/* Topup Modal */}
      {isTopupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsTopupModalOpen(false)}></div>
          <div className="bg-white dark:bg-dark-card w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-dark-border overflow-hidden relative">
            <button 
              onClick={() => setIsTopupModalOpen(false)} 
              className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="p-10">
              {/* Header */}
              <div className="mb-10 text-center">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Isi Saldo Kredit</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Pilih nominal dan metode pembayaran yang Anda inginkan.</p>
              </div>

              {/* Progress Indicator */}
              <div className="flex justify-center gap-3 mb-10">
                {[1, 2, 3].map(i => (
                  <div key={i} className={cn(
                    "w-12 h-1.5 rounded-full transition-all duration-500",
                    i <= step ? "bg-emerald-500" : "bg-slate-100 dark:bg-slate-800"
                  )}></div>
                ))}
              </div>

              {/* Step 1: Amounts */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Lite', val: 100000 },
                      { label: 'Basic', val: 250000 },
                      { label: 'Standard', val: 500000, popular: true },
                      { label: 'Enterprise', val: 1000000 }
                    ].map((amt, idx) => (
                      <button 
                        key={idx}
                        onClick={() => { setSelectedAmount(amt.val); setStep(2); }}
                        className={cn(
                          "p-6 rounded-2xl border text-center relative group transition-all",
                          amt.popular ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800" : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-dark-border hover:border-emerald-500"
                        )}
                      >
                        {amt.popular && (
                          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-[8px] text-white font-bold px-2.5 py-1 rounded-full shadow-lg">POPULAR</span>
                        )}
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{amt.label}</p>
                        <p className="text-base font-black text-slate-800 dark:text-white group-hover:text-emerald-500 transition-colors">
                          {amt.val.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
                        </p>
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 ml-1">Kustom Nominal</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-300">Rp</span>
                      <input 
                        type="number" 
                        placeholder="Min. 50.000" 
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-dark-border rounded-2xl text-sm font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Methods */}
              {step === 2 && (
                <div className="space-y-4">
                  {[
                    { id: 'qris', name: 'QRIS (OVO, Dana, GoPay)', sub: 'Konfirmasi Otomatis', icon: <QrCode className="text-emerald-500" size={20} /> },
                    { id: 'va', name: 'Virtual Account', sub: 'BCA, Mandiri, BNI', icon: <Building2 className="text-blue-500" size={20} /> }
                  ].map((method) => (
                    <button 
                      key={method.id}
                      onClick={() => setStep(3)}
                      className="w-full p-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-dark-border rounded-2xl flex items-center justify-between group hover:border-emerald-500 hover:bg-emerald-50/30 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                          {method.icon}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-800 dark:text-white">{method.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{method.sub}</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                  <button onClick={() => setStep(1)} className="w-full py-4 text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors mt-4">Kembali</button>
                </div>
              )}

              {/* Step 3: Checkout */}
              {step === 3 && (
                <div className="text-center">
                  <div className="bg-white p-6 rounded-3xl shadow-inner border border-slate-100 mx-auto w-60 h-60 relative group mb-8">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=OmniChatCheckout_${selectedAmount}`} 
                      alt="Checkout QR" 
                      className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                  <div className="space-y-1 mb-8">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Total Pembayaran:</p>
                    <h4 className="text-3xl font-black text-emerald-600">
                      {(selectedAmount || 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
                    </h4>
                  </div>
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl text-[10px] text-amber-800 dark:text-amber-400 leading-relaxed flex items-center gap-3">
                    <Clock size={24} className="shrink-0 text-amber-500" />
                    <p className="text-left">Mohon selesaikan pembayaran sebelum pukul 23:59. Saldo Anda akan bertambah otomatis setelah transaksi diverifikasi.</p>
                  </div>
                  <button 
                    onClick={() => { setIsTopupModalOpen(false); }}
                    className="w-full mt-8 bg-slate-800 dark:bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={18} /> Konfirmasi Pembayaran
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
