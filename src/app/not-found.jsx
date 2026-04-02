'use client';

import Link from 'next/link';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8 animate-float-in">
        <div className="relative">
          <h1 className="text-9xl font-black text-primary/10">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl" aria-hidden="true">🏠</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <h2 className="text-3xl font-black text-primary-dark tracking-tight">Listing Not Found</h2>
          <p className="text-neutral font-medium text-lg">
            The property you're looking for might have been sold, moved, or never existed.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/properties">
            <Button className="w-full sm:w-auto px-8 rounded-2xl font-black shadow-xl">
              Browse Marketplace
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto px-8 rounded-2xl font-black border-2">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
