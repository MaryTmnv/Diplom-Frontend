import { Link, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils/cn';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

interface SidebarProps {
  items: NavItem[];
  className?: string;
}

export const Sidebar = ({ items, className }: SidebarProps) => {
  const location = useLocation();

  return (
    <aside
      className={cn(
        'w-64 border-r bg-white h-[calc(100vh-4rem)] sticky top-16',
        className
      )}
    >
      <nav className="p-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary-50 text-primary-700 shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={cn(
                'h-5 w-5 shrink-0',
                isActive && 'text-primary-600'
              )} />
              <span className="flex-1">{item.label}</span>
              
              {/* Badge с количеством */}
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-xs font-bold min-w-[20px] text-center',
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  )}
                >
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
