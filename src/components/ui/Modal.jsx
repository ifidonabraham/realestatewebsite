'use client';

import React, { useEffect } from 'react';
import { cn } from '../../lib/utils';
import Button from './Button';

const Modal = ({ isOpen, onClose, title, children, className }) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-primary-dark/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={cn(
        "relative bg-white rounded-3xl shadow-2xl w-full max-w-lg transform transition-all overflow-hidden",
        className
      )}>
        <div className="flex items-center justify-between p-6 border-b border-neutral/10">
          <h3 className="text-xl font-bold text-primary-dark">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-light transition-colors text-neutral font-bold"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
