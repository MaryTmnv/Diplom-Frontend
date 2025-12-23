import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/lib/utils/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs = ({ items, className }: BreadcrumbsProps) => {
  return (
    <nav 
  aria-label="Навигация" 
  className={cn(
    'flex items-center gap-1 text-sm',
    className
  )}
>
  {/* Домой */}
  <Link
    to="/"
    className="flex items-center justify-center w-8 h-8 rounded-lg text-[#023e8a]/50 hover:text-[#0077b6] hover:bg-[#caf0f8]/50 transition-all duration-200"
    aria-label="Главная"
  >
    <Home className="w-4 h-4" />
  </Link>

  {/* Разделитель */}
  {items.length > 0 && (
    <ChevronRight className="w-4 h-4 text-[#90e0ef]" />
  )}

  {/* Элементы */}
  {items.map((item, index) => {
    const isLast = index === items.length - 1;

    return (
      <div key={index} className="flex items-center gap-1">
        {item.href && !isLast ? (
          <Link
            to={item.href}
            className="px-2.5 py-1.5 rounded-lg text-[#023e8a]/60 hover:text-[#0077b6] hover:bg-[#caf0f8]/50 transition-all duration-200"
          >
            {item.label}
          </Link>
        ) : (
          <span className="px-2.5 py-1.5 rounded-lg text-[#03045e] font-semibold bg-[#caf0f8]/30">
            {item.label}
          </span>
        )}

        {!isLast && (
          <ChevronRight className="w-4 h-4 text-[#90e0ef]" />
        )}
      </div>
    );
  })}
</nav>

  );
};
