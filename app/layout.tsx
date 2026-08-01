import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { Toaster } from 'react-hot-toast';

import Header from '@/components/Header/Header';

import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'TravelTrucks',
  description: 'Campers Catalog',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TanStackProvider>
          <Header />
          {children}
          <Toaster position="top-right" />
        </TanStackProvider>
      </body>
    </html>
  );
}
