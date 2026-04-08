"use client";

import React, { useState, useEffect, createContext, useContext } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[110] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={cn(
                "flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border min-w-[320px] backdrop-blur-md transition-all",
                toast.type === 'success' ? "bg-emerald-500 text-white border-emerald-400" :
                toast.type === 'error' ? "bg-rose-500 text-white border-rose-400" :
                toast.type === 'warning' ? "bg-amber-500 text-white border-amber-400" : "bg-slate-800 text-white border-slate-700"
              )}
            >
              <div className="shrink-0">
                {toast.type === 'success' && <CheckCircle2 size={24} />}
                {toast.type === 'error' && <XCircle size={24} />}
                {toast.type === 'warning' && <AlertCircle size={24} />}
                {toast.type === 'info' && <Info size={24} />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold leading-tight">{toast.message}</p>
                <p className="text-[10px] opacity-70 mt-0.5 font-medium tracking-tight uppercase tracking-widest">
                  System Notification
                </p>
              </div>
              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="hover:opacity-60 transition-opacity"
              >
                <X size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
