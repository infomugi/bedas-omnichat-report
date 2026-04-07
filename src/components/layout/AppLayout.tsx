"use client";

import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AppLayout({ children, title = "Dashboard" }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden text-slate-800 dark:text-slate-100 antialiased bg-[#f8fafc] dark:bg-dark-bg transition-colors">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <Header title={title} />
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
            
            {/* Footer */}
            <footer className="mt-8 mb-4 border-t border-slate-100 dark:border-dark-border pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500">
              <p>&copy; 2026 OmniChat Core Platform. Hak Cipta Dilindungi.</p>
              <div className="flex gap-4 mt-2 md:mt-0">
                <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Bantuan</a>
                <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">API Docs</a>
                <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Status</a>
              </div>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}
