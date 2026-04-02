import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
import { PropertyProvider } from '../context/PropertyContext';
import { AuthProvider } from '../context/AuthContext';

import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1E40AF',
};

export const metadata = {
  metadataBase: new URL('https://realestatewebsite-omega.vercel.app'),
  title: {
    default: 'Omega Real Estate | Nationwide Property Finder Nigeria',
    template: '%s | Omega Real Estate'
  },
  description: 'The most reliable platform to buy, rent, and sell properties across all 36 states in Nigeria. Connect with verified agents today.',
  keywords: ['real estate nigeria', 'house for rent lagos', 'land for sale abuja', 'nigeria property marketplace', 'verified real estate agents'],
  authors: [{ name: 'Omega PM' }],
  creator: 'Omega PM',
  publisher: 'Omega Real Estate',
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: 'Omega Real Estate Nigeria',
    description: 'Find your dream home or next investment with Nigeria\'s nationwide property marketplace.',
    url: 'https://realestatewebsite-omega.vercel.app',
    siteName: 'Omega Real Estate',
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Omega Real Estate Nigeria',
    description: 'Find verified properties across Nigeria.',
    creator: '@OmegaRealEstate',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <PropertyProvider>
            <div className="flex flex-col min-h-screen">
              <Toaster position="top-right" richColors closeButton />
              <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-white focus:text-primary font-bold shadow-2xl rounded-b-xl border-2 border-primary">
                Skip to main content
              </a>
              <Navbar />
              <main id="main-content" className="flex-grow focus:outline-none" tabIndex="-1">
                {children}
              </main>
              <Footer />
            </div>
          </PropertyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
