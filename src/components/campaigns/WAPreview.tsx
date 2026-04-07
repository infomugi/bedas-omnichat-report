"use client";

import React from 'react';
import { ArrowLeft, User, Smile, Mic, CheckCheck } from 'lucide-react';

interface WAPreviewProps {
  message: string;
}

export function WAPreview({ message }: WAPreviewProps) {
  const formatMessage = (text: string) => {
    if (!text) return "Tulis pesan di sebelah kiri untuk melihat preview...";
    
    // Simple markdown support
    return text
      .replace(/\*(.*?)\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/_(.*?)_/g, '<em class="italic">$1</em>')
      .replace(/~(.*?)~/g, '<del class="line-through opacity-60">$1</del>')
      .replace(/(\{\{.*?\}\})/g, '<span class="text-emerald-500 font-bold">$1</span>');
  };

  const currentTime = new Date().toLocaleTimeString('id-ID', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="sticky top-8 space-y-4">
      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-4">Live Preview</p>
      
      {/* Phone Mockup */}
      <div className="relative mx-auto w-full max-w-[280px] h-[580px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Speaker/Camera Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-20"></div>
        
        {/* WA Header */}
        <div className="bg-[#075e54] pt-8 pb-3 px-4 flex items-center gap-3 shrink-0">
          <ArrowLeft className="text-white/80" size={12} />
          <div className="w-8 h-8 rounded-full bg-slate-200/20 flex items-center justify-center text-white/50 overflow-hidden">
            <User size={16} />
          </div>
          <div>
            <p className="text-white text-[11px] font-bold">Penerima Blast</p>
            <p className="text-white/60 text-[8px]">Online</p>
          </div>
        </div>

        {/* WA Chat Body */}
        <div className="flex-1 bg-[#e5ddd5] dark:bg-[#0b141a] p-3 overflow-y-auto space-y-4 relative">
          {/* WA Background Pattern (Simple implementation) */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundSize: '400px' }}></div>
          
          <div className="flex justify-center relative z-10">
            <span className="bg-blue-100/80 dark:bg-blue-900/40 text-[8px] text-blue-800 dark:text-blue-200 px-3 py-1 rounded-lg uppercase font-bold tracking-wider">Hari Ini</span>
          </div>
          
          {/* Message Bubble */}
          <div className="max-w-[85%] bg-white dark:bg-[#1f2c33] p-2 rounded-xl rounded-tl-none shadow-sm shadow-black/5 relative z-10 self-start">
            <div 
              className="text-[11px] text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap break-words min-h-[40px]"
              dangerouslySetInnerHTML={{ __html: formatMessage(message) }}
            />
            <div className="flex justify-end gap-1 mt-1">
              <span className="text-[8px] opacity-40 dark:text-white/40">{currentTime}</span>
              <CheckCheck size={10} className="text-blue-400" />
            </div>
            {/* Bubble Tail */}
            <div className="absolute top-0 -left-1.5 w-0 h-0 border-t-[8px] border-t-white dark:border-t-[#1f2c33] border-l-[8px] border-l-transparent"></div>
          </div>
        </div>

        {/* WA Input */}
        <div className="p-3 bg-slate-50 dark:bg-[#121b22] flex items-center gap-2 shrink-0">
          <div className="flex-1 bg-white dark:bg-[#2a3942] rounded-full px-4 py-2 flex items-center justify-between text-slate-400 dark:text-slate-500">
            <span className="text-[10px]">Ketik pesan...</span>
            <Smile size={14} />
          </div>
          <div className="w-9 h-9 rounded-full bg-[#00a884] flex items-center justify-center text-white shadow-md">
            <Mic size={14} />
          </div>
        </div>
      </div>
      
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50 rounded-2xl p-4">
        <p className="text-[10px] text-amber-800 dark:text-amber-200 leading-relaxed">
          <span className="font-bold">Pro Tip:</span> Gunakan variabel personalisasi untu mengurangi resiko akun terblokir.
        </p>
      </div>
    </div>
  );
}
