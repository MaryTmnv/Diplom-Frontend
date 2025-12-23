import { useState, useRef } from 'react';
import { Badge, Bell, CheckCheck, X } from 'lucide-react';

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
      <Badge
        className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center p-0 text-xs font-bold bg-gradient-to-r from-[#00b4d8] to-[#0096c7] text-white border-2 border-white shadow-md animate-pulse-subtle"
      >
        {unreadCount > 99 ? '99+' : unreadCount}
      </Badge>
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
      
      <div className="absolute right-0 top-full mt-3 w-96 max-h-[600px] bg-white rounded-2xl shadow-2xl border-2 border-[#90e0ef]/30 z-50 animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#90e0ef]/30 bg-gradient-to-r from-[#caf0f8]/30 to-[#ade8f4]/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0077b6] to-[#023e8a] rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-[#03045e]">Уведомления</h3>
              {unreadCount > 0 && (
                <p className="text-xs text-[#023e8a]/60">
                  {unreadCount} {unreadCount === 1 ? 'новое' : 'новых'}
                </p>
              )}
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex items-center gap-1">

            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#023e8a]/50 hover:text-[#0077b6] hover:bg-[#caf0f8]/50 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <NotificationsList onClose={() => setIsOpen(false)} />
      </div>
    </>
  )}
</div>

  );
};
