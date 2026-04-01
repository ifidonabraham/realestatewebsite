import React from 'react';
import { cn } from '../../lib/utils';

const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ariaLabel,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-bold transition-all focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/20 shadow-lg shadow-primary/20',
    secondary: 'bg-accent text-white hover:bg-accent/90 focus:ring-accent/20 shadow-lg shadow-accent/20',
    outline: 'border-2 border-primary text-primary hover:bg-primary/5 focus:ring-primary/10',
    ghost: 'hover:bg-neutral-light text-neutral-dark focus:ring-neutral/10',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-200 shadow-lg shadow-red-200',
  };

  const sizes = {
    sm: 'h-9 px-4 text-xs tracking-wider uppercase',
    md: 'h-11 px-6 text-sm',
    lg: 'h-14 px-10 text-lg',
  };

  return (
    <button
      ref={ref}
      type={type}
      aria-label={ariaLabel}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    />
  );
});

Button.displayName = "Button";

export default Button;
