import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { X } from 'lucide-react';
import { Button } from '@/shared/ui';
import { cn } from '@/shared/lib/utils/cn';
import { Notification as AppNotification, NotificationType } from '../types/notifications.types';

interface NotificationItemProps {
  notification: AppNotification;
  onClick?: () => void;
  onDelete?: () => void;
}

const getNotificationIcon = (type: NotificationType): string => {
  const icons: Partial<Record<NotificationType, string>> = {
    [NotificationType.TICKET_CREATED]: '🎫',
    [NotificationType.TICKET_UPDATED]: '🔄',
    [NotificationType.TICKET_ASSIGNED]: '👤',
    [NotificationType.TICKET_RESOLVED]: '✅',
    [NotificationType.TICKET_CLOSED]: '🔒',
    [NotificationType.NEW_MESSAGE]: '💬',
    [NotificationType.MENTION]: '📢',
    [NotificationType.SYSTEM]: 'ℹ️',
  };
  return icons[type] || '🔔';
};

const getNotificationStyles = (type: NotificationType): string => {
  const styles: Partial<Record<NotificationType, string>> = {
    [NotificationType.TICKET_CREATED]: 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-md',
    [NotificationType.TICKET_UPDATED]: 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-md',
    [NotificationType.TICKET_ASSIGNED]: 'bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-md',
    [NotificationType.TICKET_RESOLVED]: 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-md',
    [NotificationType.TICKET_CLOSED]: 'bg-gradient-to-br from-gray-500 to-gray-600 shadow-md',
    [NotificationType.NEW_MESSAGE]: 'bg-gradient-to-br from-[#0077b6] to-[#023e8a] shadow-md',
    [NotificationType.MENTION]: 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-md',
    [NotificationType.SYSTEM]: 'bg-gradient-to-br from-[#48cae4] to-[#0096c7] shadow-md',
  };
  return styles[type] || 'bg-gradient-to-br from-[#48cae4] to-[#0096c7] shadow-md';
};

export const NotificationItem = ({ notification, onClick, onDelete }: NotificationItemProps) => {
  const handleClick = () => {
    onClick?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <div
      className={cn(
        'group relative p-4 border-b border-[#90e0ef]/20 hover:bg-[#caf0f8]/20 transition-all duration-200 cursor-pointer',
        !notification.isRead && 'bg-[#caf0f8]/10'
      )}
      onClick={handleClick}
    >
      {/* Индикатор непрочитанного */}
      {!notification.isRead && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#0077b6] rounded-full animate-pulse" />
      )}

      <div className="flex items-start gap-3 pl-4">
        {/* Иконка */}
        <div className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0',
          getNotificationStyles(notification.type)
        )}>
          <span className="text-lg">{getNotificationIcon(notification.type)}</span>
        </div>

        {/* Контент */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className={cn(
                'text-sm font-semibold text-[#03045e] mb-1',
                !notification.isRead && 'font-bold'
              )}>
                {notification.title}
              </h4>
              <p className="text-sm text-[#023e8a]/70 line-clamp-2">
                {notification.message}
              </p>
            </div>

            {/* Кнопка удаления */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-[#023e8a]/50 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>

          {/* Время */}
          <p className="text-xs text-[#023e8a]/50 mt-2">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
              locale: ru,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};
