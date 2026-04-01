import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
import { PropertyProvider } from '../context/PropertyContext';
import { AuthProvider } from '../context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL('https://realestatefinder.ng'),
  title: {
    default: 'Real Estate Finder | Find Your Dream Home in Nigeria',
    template: '%s | Real Estate Finder'
  },
  description: 'The most seamless way to discover, view, and secure residential, land, and commercial properties from verified agents across Lagos, Abuja, and Nigeria.',
  openGraph: {
    title: 'Real Estate Finder',
    description: 'Find your dream home with our seamless property platform.',
    url: 'https://realestatefinder.ng',
    siteName: 'Real Estate Finder',
    locale: 'en_NG',
    type: 'website',
  },
};

import { Toaster } from 'sonner';

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
