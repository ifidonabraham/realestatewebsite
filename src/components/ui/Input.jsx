import React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ className, label, error, id, ...props }, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  
  return (
    <div className="w-full space-y-2">
      {label && (
        <label htmlFor={inputId} className="text-xs font-black text-primary-dark uppercase tracking-widest">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={cn(
          "flex h-12 w-full rounded-2xl border-2 border-neutral/10 bg-white px-4 py-2 text-sm font-bold placeholder:text-neutral/40 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          error && "border-red-500 focus:ring-red-500/10 focus:border-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs font-bold text-red-500 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

const Textarea = React.forwardRef(({ className, label, error, id, ...props }, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-2">
      {label && (
        <label htmlFor={inputId} className="text-xs font-black text-primary-dark uppercase tracking-widest">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={cn(
          "flex min-h-[120px] w-full rounded-2xl border-2 border-neutral/10 bg-white px-4 py-3 text-sm font-bold placeholder:text-neutral/40 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none",
          error && "border-red-500 focus:ring-red-500/10 focus:border-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs font-bold text-red-500 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = "Textarea";

export { Input, Textarea };
