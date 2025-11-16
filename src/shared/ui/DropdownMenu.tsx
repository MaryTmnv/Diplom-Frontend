import React, { forwardRef, HTMLAttributes, useState, useRef } from 'react';
import { cn } from '@/shared/lib/utils/cn';
import { useClickOutside } from '@/shared/hooks/useClickOutside';

// Context для управления состоянием
interface DropdownContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownContext = React.createContext<DropdownContextValue | null>(null);

const useDropdownContext = () => {
  const context = React.useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown components must be used within DropdownMenu');
  }
  return context;
};

// DropdownMenu (root)
export interface DropdownMenuProps {
  children: React.ReactNode;
}

export const DropdownMenu = ({ children }: DropdownMenuProps) => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
};

// DropdownMenuTrigger
export interface DropdownMenuTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

export const DropdownMenuTrigger = ({ asChild, children }: DropdownMenuTriggerProps) => {
  const { open, setOpen } = useDropdownContext();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: any) => {
        e?.preventDefault?.();
        setOpen(!open);
      },
    });
  }

  return (
    <button onClick={() => setOpen(!open)} type="button">
      {children}
    </button>
  );
};

// DropdownMenuContent
export interface DropdownMenuContentProps extends HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end';
}

export const DropdownMenuContent = forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ className, align = 'end', children, ...props }, ref) => {
    const { open, setOpen } = useDropdownContext();
    const contentRef = useRef<HTMLDivElement>(null);

    useClickOutside(contentRef, () => setOpen(false));

    if (!open) return null;

    const alignClasses = {
      start: 'left-0',
      center: 'left-1/2 -translate-x-1/2',
      end: 'right-0',
    };

    return (
      <div
        ref={contentRef}
        className={cn(
          'absolute top-full mt-2 z-50',
          'min-w-[12rem] rounded-lg border border-gray-200 bg-white p-1 shadow-lg',
          'animate-fade-in',
          alignClasses[align],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DropdownMenuContent.displayName = 'DropdownMenuContent';

// DropdownMenuItem
export interface DropdownMenuItemProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  disabled?: boolean;
}

export const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  ({ className, asChild, children, onClick, disabled, ...props }, ref) => {
    const { setOpen } = useDropdownContext();

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
      setOpen(false);
    };

    // Если asChild - клонируем дочерний элемент
    if (asChild && React.isValidElement(children)) {
      const childElement = children as React.ReactElement<any>;
      return React.cloneElement(childElement, {
        className: cn(
          'flex cursor-pointer items-center rounded-md px-3 py-2 text-sm',
          'hover:bg-gray-100 focus:bg-gray-100',
          'transition-colors duration-150',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          childElement.props?.className
        ),
        onClick: handleClick,
      });
    }

    // Обычный рендер
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center rounded-md px-3 py-2 text-sm',
          'transition-colors duration-150',
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'cursor-pointer hover:bg-gray-100 focus:bg-gray-100',
          className
        )}
        onClick={disabled ? undefined : handleClick}
        aria-disabled={disabled}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DropdownMenuItem.displayName = 'DropdownMenuItem';

// DropdownMenuLabel
export const DropdownMenuLabel = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-3 py-2 text-sm font-semibold', className)}
        {...props}
      />
    );
  }
);
DropdownMenuLabel.displayName = 'DropdownMenuLabel';

// DropdownMenuSeparator
export const DropdownMenuSeparator = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('my-1 h-px bg-gray-200', className)}
        {...props}
      />
    );
  }
);
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';
