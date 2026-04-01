'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function ImageGallery({ mainImage, gallery = [] }) {
  const allImages = [mainImage, ...gallery].filter(Boolean);
  const [currentIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  if (!allImages.length) return null;

  return (
    <div className="space-y-6">
      {/* Main Display */}
      <div className="relative aspect-[16/9] rounded-[40px] overflow-hidden shadow-2xl group bg-neutral-light">
        <img 
          src={allImages[currentIndex]} 
          alt={`Property view ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-primary-dark shadow-xl"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-primary-dark shadow-xl"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}

        {/* Counter Badge */}
        <div className="absolute bottom-6 right-6 bg-primary-dark/60 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black text-white uppercase tracking-widest border border-white/10 shadow-2xl">
          {currentIndex + 1} / {allImages.length} Photos
        </div>
      </div>

      {/* Thumbnail Track */}
      {allImages.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar px-2">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={cn(
                "relative w-32 h-24 rounded-2xl overflow-hidden shrink-0 transition-all border-4",
                currentIndex === idx ? "border-primary scale-105 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <img src={img} className="w-full h-full object-cover" alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
