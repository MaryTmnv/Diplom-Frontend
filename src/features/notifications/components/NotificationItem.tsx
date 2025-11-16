import { formatRelativeTime } from '@/shared/lib/utils/formatters';
import { X } from 'lucide-react';
import { cn } from '@/shared/lib/utils/cn';
import { Notification as AppNotification, NotificationType } from '../types/notifications.types';

interface NotificationItemProps {
  notification: AppNotification;  // ← используем AppNotification
  onClick?: () => void;
  onDelete?: () => void;
}

const getNotificationIcon = (type: NotificationType): string => {
  const icons: Record<NotificationType, string> = {
    [NotificationType.TICKET_CREATED]: '🎫',
    [NotificationType.TICKET_UPDATED]: '🔄',
    [NotificationType.TICKET_ASSIGNED]: '👤',
    [NotificationType.TICKET_RESOLVED]: '✅',
    [NotificationType.NEW_MESSAGE]: '💬',
    [NotificationType.MENTION]: '📢',
  };
  return icons[type];
};

export const NotificationItem = ({ 
  notification, 
  onClick, 
  onDelete 
}: NotificationItemProps) => {
  return (
    <div
      className={cn(
        'relative p-4 hover:bg-gray-50 transition-colors cursor-pointer group',
        !notification.isRead && 'bg-blue-50/50'
      )}
      onClick={onClick}
    >
      {/* Индикатор непрочитанного */}
      {!notification.isRead && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary-600 rounded-full" />
      )}

      <div className="flex items-start gap-3 pl-4">
        {/* Иконка */}
        <div className="text-2xl shrink-0">
          {getNotificationIcon(notification.type)}
        </div>

        {/* Контент */}
        <div className="flex-1 min-w-0">
          <p className={cn(
            'text-sm mb-1',
            notification.isRead ? 'text-gray-700' : 'text-gray-900 font-medium'
          )}>
            {notification.title}
          </p>
          <p className="text-xs text-gray-600 line-clamp-2">
            {notification.message}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatRelativeTime(notification.createdAt)}
          </p>
        </div>

        {/* Кнопка удаления */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all"
          aria-label="Удалить уведомление"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
};
