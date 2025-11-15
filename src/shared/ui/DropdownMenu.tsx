
import { cn } from '@/shared/lib/utils/cn';
import { useClickOutside } from '@/shared/hooks/useClickOutside';
import { ReactNode, useState, useRef } from 'react';

interface DropdownMenuProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'start' | 'end';
}

export const DropdownMenu = ({ trigger, children, align = 'end' }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {/* Menu */}
      {isOpen && (
        <div
          className={cn(
            'absolute top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-scale-in',
            align === 'end' ? 'right-0' : 'left-0'
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  onClick?: () => void;
}

export const DropdownMenuItem = ({ children, onClick, className, ...props }: DropdownMenuItemProps) => {
  return (
    <div
      className={cn(
        'px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors flex items-center',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export const DropdownMenuLabel = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('px-3 py-2 text-sm font-semibold text-gray-900', className)} {...props}>
      {children}
    </div>
  );
};

export const DropdownMenuSeparator = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn('my-1 h-px bg-gray-200', className)} {...props} />;
};
