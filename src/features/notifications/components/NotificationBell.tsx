import { useState, useRef } from 'react';
import { Badge, Bell } from 'lucide-react';

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
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Уведомления"
      >
        <Bell className={cn(
          'h-5 w-5',
          !isConnected && 'text-gray-400'
        )} />
        
        {/* Счётчик непрочитанных */}
        {unreadCount > 0 && (
          <Badge
            className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}

        {/* Индикатор подключения */}
        {isConnected && (
          <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white" />
        )}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 max-h-[600px] bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-scale-in overflow-hidden">
          <NotificationsList onClose={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
};
