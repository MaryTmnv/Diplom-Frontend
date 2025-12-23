import { formatRelativeTime } from '@/shared/lib/utils/formatters';
import { CheckCircle, Clock, X } from 'lucide-react';
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
    [NotificationType.TICKET_CLOSED]: '',
    [NotificationType.SYSTEM]: ''
  };
  return icons[type];
};



export const NotificationItem = ({ 
  notification, 
  onClick, 
  onDelete 
}: NotificationItemProps) => {

const getNotificationIconStyle = (type: NotificationType): string => {
  const styles: Record<NotificationType, string> = {
    [NotificationType.TICKET_CREATED]: 'bg-gradient-to-br from-[#00b4d8] to-[#0096c7] shadow-md',
    [NotificationType.TICKET_UPDATED]: 'bg-gradient-to-br from-[#48cae4] to-[#0096c7] shadow-md',
    [NotificationType.TICKET_ASSIGNED]: 'bg-gradient-to-br from-[#0077b6] to-[#023e8a] shadow-md',
    [NotificationType.TICKET_CLOSED]: 'bg-gradient-to-br from-green-500 to-emerald-500 shadow-md',
    [NotificationType.NEW_MESSAGE]: 'bg-gradient-to-br from-[#00b4d8] to-[#0096c7] shadow-md',
    [NotificationType.SYSTEM]: 'bg-gradient-to-br from-[#48cae4] to-[#0096c7] shadow-md',
    [NotificationType.TICKET_RESOLVED]: '',
    [NotificationType.MENTION]: ''
  };
  
  return styles[type] || styles[NotificationType.SYSTEM];
};


  return (
    <div
  className={cn(
    'relative p-4 transition-all duration-200 cursor-pointer group border-b border-[#90e0ef]/20 last:border-b-0',
    notification.isRead 
      ? 'hover:bg-[#caf0f8]/20' 
      : 'bg-gradient-to-r from-[#caf0f8]/30 to-[#ade8f4]/20 hover:from-[#caf0f8]/50 hover:to-[#ade8f4]/30'
  )}
  onClick={onClick}
>
  {/* Индикатор непрочитанного */}
  {!notification.isRead && (
    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#00b4d8] rounded-full animate-pulse-subtle shadow-sm" />
  )}

  <div className="flex items-start gap-4 pl-4">
    {/* Иконка */}
    <div className={cn(
      'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200',
      getNotificationIconStyle(notification.type),
      'group-hover:scale-105'
    )}>
      {getNotificationIcon(notification.type)}
    </div>

    {/* Контент */}
    <div className="flex-1 min-w-0">
      <p className={cn(
        'text-sm mb-1 leading-relaxed',
        notification.isRead 
          ? 'text-[#023e8a]/70' 
          : 'text-[#03045e] font-semibold'
      )}>
        {notification.title}
      </p>
      <p className="text-xs text-[#023e8a]/60 line-clamp-2 leading-relaxed">
        {notification.message}
      </p>
      
      {/* Footer */}
      <div className="flex items-center gap-2 mt-2">
        <div className="flex items-center gap-1 text-xs text-[#023e8a]/40">
          <Clock className="w-3 h-3" />
          <span>{formatRelativeTime(notification.createdAt)}</span>
        </div>
      
      </div>
    </div>

    {/* Кнопки действий */}
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
      {/* Отметить как прочитанное/непрочитанное */}
      {!notification.isRead && (
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="p-1.5 hover:bg-[#caf0f8] rounded-lg transition-colors"
          aria-label="Отметить как прочитанное"
          title="Отметить как прочитанное"
        >
          <CheckCircle className="w-4 h-4 text-[#0077b6]" />
        </button>
      )}
      
      {/* Удалить */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.();
        }}
        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
        aria-label="Удалить уведомление"
        title="Удалить"
      >
        <X className="w-4 h-4 text-red-500" />
      </button>
    </div>
  </div>
</div>

  );
};
