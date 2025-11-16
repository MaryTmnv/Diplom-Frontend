import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const variantClasses = {
  default: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-300 shadow-sm hover:shadow',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-300',
  ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-300 shadow-sm hover:shadow',
  outline: 'border-2 border-gray-300 bg-white hover:bg-gray-50 focus:ring-gray-200',
};

const sizeClasses = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-5 py-2.5',
  lg: 'h-12 px-6 text-lg',
  icon: 'h-10 w-10',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2',
          'rounded-lg font-medium',
          'focus:ring-4 focus:outline-none',
          'transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          'active:scale-95',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
