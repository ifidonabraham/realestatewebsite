import React from 'react';
import { cn } from '../../lib/utils';

export default function Logo({ className, showText = true }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex items-center justify-center w-10 h-10 shrink-0">
        {/* Shield Background */}
        <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full drop-shadow-sm">
          <path 
            d="M20 2 L34 8 V18 C34 26.5 28 34.2 20 38 C12 34.2 6 26.5 6 18 V8 L20 2Z" 
            fill="#1E40AF" 
          />
        </svg>
        
        {/* House Silhouette */}
        <svg viewBox="0 0 24 24" className="relative w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>

        {/* Verification Checkmark (The Visual Hook) */}
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-md">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-blue-500" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </div>
      </div>

      {showText && (
        <span className="text-2xl font-black text-primary-dark tracking-tighter uppercase italic">
          Omega<span className="text-accent not-italic">Estate</span>
        </span>
      )}
    </div>
  );
}
