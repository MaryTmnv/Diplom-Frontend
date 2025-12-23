import { Link, useLocation } from 'react-router-dom';
import { BookOpen, HelpCircle, LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils/cn';
import { Button } from '@/shared/ui';

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
    'w-72 border-r border-[#90e0ef]/30 bg-gradient-to-b from-white to-[#caf0f8]/20 h-[calc(100vh-4rem)] sticky top-16',
    className
  )}
>
  {/* Заголовок секции (опционально) */}
  <div className="px-5 py-4 border-b border-[#90e0ef]/30">
    <p className="text-xs font-semibold text-[#023e8a]/50 uppercase tracking-wider">
      Навигация
    </p>
  </div>

  <nav className="p-4 space-y-1.5">
    {items.map((item) => {
      const Icon = item.icon;
      const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');

      return (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            'group flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200',
            isActive
              ? 'bg-gradient-to-r from-[#0077b6] to-[#023e8a] text-white shadow-lg shadow-[#0077b6]/20'
              : 'text-[#023e8a]/70 hover:bg-[#caf0f8]/50 hover:text-[#03045e]'
          )}
          aria-current={isActive ? 'page' : undefined}
        >
          <div
            className={cn(
              'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200',
              isActive
                ? 'bg-white/20'
                : 'bg-[#90e0ef]/30 group-hover:bg-[#90e0ef]/50'
            )}
          >
            <Icon
              className={cn(
                'h-5 w-5',
                isActive ? 'text-white' : 'text-[#0077b6]'
              )}
            />
          </div>
          <span className="flex-1">{item.label}</span>

          {/* Badge с количеством */}
          {item.badge !== undefined && item.badge > 0 && (
            <span
              className={cn(
                'px-2.5 py-1 rounded-full text-xs font-bold min-w-[24px] text-center transition-all',
                isActive
                  ? 'bg-white text-[#0077b6]'
                  : 'bg-gradient-to-r from-[#00b4d8] to-[#0096c7] text-white shadow-sm'
              )}
            >
              {item.badge > 99 ? '99+' : item.badge}
            </span>
          )}

          {/* Индикатор активности */}
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
          )}
        </Link>
      );
    })}
  </nav>

  {/* Нижняя секция (опционально) */}
  <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#90e0ef]/30 bg-white/80 backdrop-blur-sm">
    <div className="p-4 bg-gradient-to-br from-[#caf0f8]/50 to-[#ade8f4]/30 rounded-xl">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-gradient-to-br from-[#48cae4] to-[#0096c7] rounded-lg flex items-center justify-center">
          <HelpCircle className="w-4 h-4 text-white" />
        </div>
        <p className="text-sm font-semibold text-[#03045e]">Нужна помощь?</p>
      </div>
      <p className="text-xs text-[#023e8a]/60 mb-3">
        Ознакомьтесь с документацией или свяжитесь с поддержкой
      </p>
      <Button
        variant="ghost"
        size="sm"
        className="w-full text-[#0077b6] hover:bg-[#0077b6] hover:text-white rounded-lg transition-all text-xs font-medium"
      >
        <BookOpen className="w-3 h-3 mr-2" />
        Документация
      </Button>
    </div>
  </div>
</aside>

  );
};
