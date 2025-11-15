import { forwardRef, InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/shared/lib/utils/cn';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, checked, ...props }, ref) => {
    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          className="peer sr-only"
          {...props}
        />
        <div
          className={cn(
            'h-5 w-5 rounded border-2 border-gray-300',
            'peer-checked:bg-primary-600 peer-checked:border-primary-600',
            'peer-focus:ring-2 peer-focus:ring-primary-200',
            'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
            'transition-all duration-200 cursor-pointer',
            'flex items-center justify-center',
            className
          )}
        >
          {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
