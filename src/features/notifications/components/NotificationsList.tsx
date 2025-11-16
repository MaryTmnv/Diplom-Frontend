import { Button } from '@/shared/ui';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import { EmptyState } from '@/shared/components/EmptyState';
import { CheckCheck } from 'lucide-react';

interface NotificationsListProps {
  onClose?: () => void;
}

export const NotificationsList = ({ onClose }: NotificationsListProps) => {
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const handleNotificationClick = (notification: any) => {
    // Закрываем dropdown
    onClose?.();

    // Переходим к связанной сущности
    if (notification.entityType === 'ticket' && notification.entityId) {
      window.location.href = `/client/tickets/${notification.entityId}`;
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div>
          <h3 className="font-semibold text-gray-900">Уведомления</h3>
          {unreadCount > 0 && (
            <p className="text-xs text-gray-500">
              {unreadCount} непрочитанных
            </p>
          )}
        </div>

        {/* Действия */}
        {notifications.length > 0 && unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markAllAsRead()}
            className="text-xs"
          >
            <CheckCheck className="w-4 h-4 mr-1" />
            Прочитать все
          </Button>
        )}
      </div>

      {/* Список */}
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon="🔔"
              title="Нет уведомлений"
              description="Здесь будут появляться важные обновления"
            />
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={() => handleNotificationClick(notification)}
                onDelete={() => deleteNotification(notification.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
