'use client';

import React, { useEffect } from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

export default function BottomSheet({ isOpen, onClose, title, children }) {
  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sheet */}
      <div 
        className={cn(
          "fixed inset-x-0 bottom-0 z-[120] bg-white rounded-t-[40px] shadow-2xl transition-transform duration-500 ease-out md:hidden flex flex-col max-h-[90vh]",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* Handle bar */}
        <div className="w-full flex justify-center py-4">
          <div className="w-12 h-1.5 bg-neutral-light rounded-full" />
        </div>

        {/* Header */}
        <div className="px-8 pb-4 flex justify-between items-center border-b border-neutral/5">
          <h2 className="text-xl font-black text-primary-dark uppercase tracking-widest">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-neutral-light rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 pt-6">
          {children}
        </div>
      </div>
    </>
  );
}
