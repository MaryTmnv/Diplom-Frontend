import { useState, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { useClickOutside } from '@/shared/hooks/useClickOutside';
import { cn } from '@/shared/lib/utils/cn';
import { Button } from '@/shared/ui';
import { NotificationsList } from './NotificationsList';

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { unreadCount, isConnected } = useNotifications();

  // Закрываем при клике вне
  useClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Кнопка */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'relative w-10 h-10 rounded-xl transition-all duration-200',
          isOpen 
            ? 'bg-[#caf0f8] text-[#0077b6]' 
            : 'text-[#023e8a]/70 hover:text-[#0077b6] hover:bg-[#caf0f8]/50',
          !isConnected && 'opacity-50'
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Уведомления"
        aria-expanded={isOpen}
      >
        <Bell className={cn(
          'h-5 w-5 transition-transform duration-200',
          isOpen && 'scale-110',
          unreadCount > 0 && 'animate-bell-ring'
        )} />
        
        {/* Счётчик непрочитанных */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center px-1 text-xs font-bold bg-gradient-to-r from-[#00b4d8] to-[#0096c7] text-white rounded-full border-2 border-white shadow-md">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}

        {/* Индикатор подключения */}
        <span 
          className={cn(
            'absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white transition-colors duration-300',
            isConnected ? 'bg-green-500' : 'bg-gray-400'
          )}
          aria-label={isConnected ? 'Подключено' : 'Отключено'}
        />
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop для закрытия */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          <div className="absolute right-0 top-full mt-3 w-96 bg-white rounded-2xl shadow-2xl border-2 border-[#90e0ef]/30 z-50 animate-scale-in overflow-hidden">
            {/* Передаём onClose в NotificationsList */}
            <NotificationsList onClose={() => setIsOpen(false)} />
          </div>
        </>
      )}
    </div>
  );
};
