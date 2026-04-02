'use client';

import { useEffect } from 'react';
import Button from '../components/ui/Button';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8 p-10 bg-red-50 rounded-[48px] border-2 border-red-100">
        <div className="w-20 h-20 bg-red-500 text-white rounded-3xl flex items-center justify-center mx-auto text-4xl shadow-2xl shadow-red-200">
          ⚠️
        </div>
        
        <div className="space-y-3">
          <h2 className="text-3xl font-black text-primary-dark tracking-tight">Something went wrong</h2>
          <p className="text-red-600/80 font-bold uppercase tracking-widest text-xs">
            System Error Occurred
          </p>
          <p className="text-neutral font-medium">
            We've encountered an unexpected issue while loading this page. Our team has been notified.
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <Button 
            onClick={() => reset()}
            className="w-full rounded-2xl font-black shadow-xl bg-red-500 hover:bg-red-600 text-white border-none shadow-red-200"
          >
            Try Again
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = '/'}
            className="w-full font-black text-neutral hover:text-primary"
          >
            Return to Safety
          </Button>
        </div>
      </div>
    </div>
  );
}
