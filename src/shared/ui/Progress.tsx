import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/shared/lib/utils/cn';

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  showLabel?: boolean;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, showLabel = false, className, ...props }, ref) => {
    const percentage = Math.min(Math.max(value, 0), 100);

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-primary-600 transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showLabel && (
          <p className="text-xs text-gray-600 mt-1 text-right">
            {percentage}%
          </p>
        )}
      </div>
    );
  }
);

Progress.displayName = 'Progress';
