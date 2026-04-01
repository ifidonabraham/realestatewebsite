import { cn } from "../../lib/utils";

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-neutral-light/50", className)}
      {...props}
    />
  );
}
