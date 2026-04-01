import React from 'react';
import { cn } from '../../lib/utils';
import Image from 'next/image';

const Card = ({ className, children, as: Tag = 'div', ...props }) => {
  return (
    <Tag
      className={cn(
        "rounded-[32px] border border-neutral/10 bg-white text-neutral-dark overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
};

const CardHeader = ({ className, ...props }) => (
  <header className={cn("p-6 space-y-1.5", className)} {...props} />
);

const CardTitle = ({ className, ...props }) => (
  <h3 className={cn("text-xl font-bold leading-none tracking-tight", className)} {...props} />
);

const CardDescription = ({ className, ...props }) => (
  <p className={cn("text-sm text-neutral font-medium", className)} {...props} />
);

const CardContent = ({ className, ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);

const CardFooter = ({ className, ...props }) => (
  <footer className={cn("flex items-center p-6 pt-0", className)} {...props} />
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
