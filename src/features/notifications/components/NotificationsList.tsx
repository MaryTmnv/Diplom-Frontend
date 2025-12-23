import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bell, BellOff, CheckCheck, Loader2, X } from 'lucide-react';
import { Button } from '@/shared/ui';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationItem } from './NotificationItem';

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
  
  const [isLoading] = useState(false);
  const navigate = useNavigate();

  const handleNotificationClick = (notification: any) => {
    // Закрываем dropdown
    onClose?.();

    // Переходим к связанной сущности
    if (notification.entityType === 'ticket' && notification.entityId) {
      navigate(`/client/tickets/${notification.entityId}`);
    }
  };

  return (
    <div className="flex flex-col max-h-[600px]">
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
                {unreadCount} {unreadCount === 1 ? 'непрочитанное' : 'непрочитанных'}
              </p>
            )}
          </div>
        </div>

        {/* Действия */}
        <div className="flex items-center gap-1">
          {notifications.length > 0 && unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllAsRead()}
              className="h-8 text-xs text-[#0077b6] hover:bg-[#caf0f8]/50 rounded-lg font-medium"
            >
              <CheckCheck className="w-3 h-3 mr-1" />
              Прочитать все
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-[#023e8a]/50 hover:text-[#0077b6] hover:bg-[#caf0f8]/50 rounded-lg"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Список */}
      <div className="flex-1 overflow-y-auto max-h-[400px]">
        {isLoading ? (
          // Loading state
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[#caf0f8] to-[#ade8f4] rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Loader2 className="w-6 h-6 text-[#0077b6] animate-spin" />
            </div>
            <p className="text-sm text-[#023e8a]/60">Загрузка уведомлений...</p>
          </div>
        ) : notifications.length === 0 ? (
          // Empty state
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#caf0f8] to-[#ade8f4] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <BellOff className="w-10 h-10 text-[#0077b6]" />
            </div>
            <h3 className="text-lg font-bold text-[#03045e] mb-2">
              Нет уведомлений
            </h3>
            <p className="text-sm text-[#023e8a]/60 max-w-xs mx-auto">
              Здесь будут появляться важные обновления о ваших заявках
            </p>
          </div>
        ) : (
          // Notifications list
          <div>
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

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-[#90e0ef]/30 bg-[#caf0f8]/10 text-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-[#0077b6] hover:bg-[#caf0f8]/50 rounded-lg font-medium"
            onClick={() => {
              onClose?.();
              navigate('/notifications');
            }}
          >
            Посмотреть все уведомления
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};
