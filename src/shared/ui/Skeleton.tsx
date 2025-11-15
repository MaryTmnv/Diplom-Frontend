import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/shared/lib/utils/cn';

export const Skeleton = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('animate-pulse bg-gray-200 rounded', className)}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';
