import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { CommandPalette } from "@/components/layout/CommandPalette";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "OmniChat Platform",
  description: "Multichannel Communication Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable}`}>
      <body className="antialiased">
        <ToastProvider>
           <CommandPalette />
           {children}
        </ToastProvider>
      </body>
    </html>
  );
}
