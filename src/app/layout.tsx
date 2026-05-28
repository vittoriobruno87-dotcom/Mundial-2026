// ============================================================
// LAYOUT PRINCIPALE
// ============================================================

import type { Metadata, Viewport } from 'next';
import { Bebas_Neue, DM_Sans } from 'next/font/google';
import './globals.css';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
});

export const metadata: Metadata = {
  title: 'Mundial 2026 – Gioco Amici',
  description: 'Classifica e risultati del tuo gruppo di amici per il Mondiale 2026',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Mundial 2026',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A0E1A',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${bebasNeue.variable} ${dmSans.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
