'use client';

import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { Skeleton } from './Skeleton';

export default function PremiumImage({ src, alt, className, containerClassName }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden bg-neutral-light", containerClassName)}>
      {/* Skeleton while loading */}
      {!isLoaded && (
        <Skeleton className="absolute inset-0 z-10 w-full h-full" />
      )}
      
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
        className={cn(
          "w-full h-full object-cover transition-all duration-1000",
          isLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-110 blur-2xl",
          className
        )}
      />
    </div>
  );
}
