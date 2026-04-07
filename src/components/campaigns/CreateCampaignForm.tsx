"use client";

import React, { useState } from 'react';
import { 
  Info, 
  Pen, 
  Users, 
  ArrowRight, 
  Check, 
  Save,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { WAPreview } from './WAPreview';

interface CreateCampaignFormProps {
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

export function CreateCampaignForm({ onCancel, onSubmit }: CreateCampaignFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    sender: 'CS Utama (+62812...)',
    category: 'Promosi',
    message: '',
    schedule: 'immediate'
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const insertVariable = (variable: string) => {
    setFormData(prev => ({
      ...prev,
      message: prev.message + ` {{${variable}}}`
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Form Card */}
      <div className="lg:col-span-2 space-y-8">
        {/* Step Indicator */}
        <div className="flex items-center justify-between relative px-4 mb-8">
          <div className="absolute inset-0 flex items-center px-8" aria-hidden="true">
            <div className="w-full border-t-2 border-slate-100 dark:border-dark-border"></div>
          </div>
          
          {[1, 2, 3].map((s) => (
            <div key={s} className="relative flex flex-col items-center gap-2">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all shadow-sm",
                step === s ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 ring-4 ring-white dark:ring-slate-900" : 
                step > s ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40" : 
                "bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-dark-border text-slate-400"
              )}>
                {step > s ? <Check size={18} /> : s}
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wider",
                step === s ? "text-slate-800 dark:text-white" : "text-slate-400"
              )}>
                {s === 1 ? 'Detail' : s === 2 ? 'Pesan' : 'Konfirmasi'}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-dark-card rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm p-8 transition-all">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm"><Info size={16} /></span>
                Informasi Dasar
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Nama Kampanye</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Misal: Promo Akhir Tahun 2026" 
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-dark-border rounded-xl text-sm focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-900/30 outline-none transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Sender</label>
                    <select 
                      value={formData.sender}
                      onChange={(e) => setFormData({...formData, sender: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-dark-border rounded-xl text-sm outline-none cursor-pointer"
                    >
                      <option>CS Utama (+62812...)</option>
                      <option>Marketing A (+62857...)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Kategori</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-dark-border rounded-xl text-sm outline-none cursor-pointer"
                    >
                      <option>Promosi</option>
                      <option>Notifikasi</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm"><Pen size={16} /></span>
                Isi Pesan
              </h3>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {['Nama', 'Tanggal', 'Kupon'].map(v => (
                    <button 
                      key={v}
                      onClick={() => insertVariable(v)}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 rounded-lg hover:bg-emerald-500 hover:text-white transition-all border border-transparent hover:border-emerald-400"
                    >
                      +{v}
                    </button>
                  ))}
                </div>
                <textarea 
                  rows={8}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Tuliskan pesan Anda di sini..." 
                  className="w-full p-6 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-dark-border rounded-2xl text-sm focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-900/30 outline-none transition-all resize-none"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm"><Users size={16} /></span>
                Konfirmasi & Jadwal
              </h3>
              
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-dark-border space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Nama Kampanye</span>
                  <span className="font-bold text-slate-800 dark:text-white">{formData.name || '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Target Penerima</span>
                  <span className="font-bold text-emerald-600">350.000 Nomor</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Estimasi Biaya</span>
                  <span className="font-bold text-slate-800 dark:text-white">Rp 1.050.000</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Jadwal Pengiriman</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setFormData({...formData, schedule: 'immediate'})}
                    className={cn(
                      "p-4 rounded-xl border text-sm font-bold transition-all",
                      formData.schedule === 'immediate' ? "bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-900/20" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-dark-border text-slate-400"
                    )}
                  >
                    Kirim Sekarang
                  </button>
                  <button 
                    onClick={() => setFormData({...formData, schedule: 'later'})}
                    className={cn(
                      "p-4 rounded-xl border text-sm font-bold transition-all",
                      formData.schedule === 'later' ? "bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-900/20" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-dark-border text-slate-400"
                    )}
                  >
                    Jadwalkan Nanti
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-slate-100 dark:border-dark-border flex justify-between items-center">
            <button 
              onClick={step === 1 ? onCancel : prevStep}
              className="text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              {step === 1 ? 'Batalkan' : 'Kembali'}
            </button>
            <div className="flex gap-3">
              <button 
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
              >
                <Save size={16} />
                Simpan Draft
              </button>
              <button 
                onClick={step === 3 ? () => onSubmit(formData) : nextStep}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
              >
                {step === 3 ? 'Kirim Sekarang' : 'Lanjut'}
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Preview */}
      <WAPreview message={formData.message} />
    </div>
  );
}
