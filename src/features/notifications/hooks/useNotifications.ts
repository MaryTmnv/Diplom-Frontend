import { useEffect, useState, useCallback } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Socket } from 'socket.io-client';
import { initNotificationsSocket } from '@/shared/lib/api/websocket';
import { notificationsApi } from '../api/notificationsApi';
import { Notification as AppNotification, NotificationType } from '../types/notifications.types';
import { queryKeys } from '@/shared/lib/api/queryClient';
import { useAuthStore } from '@/features/auth/store/authStore';
import toast from 'react-hot-toast';

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const { accessToken } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Загружаем уведомления через REST API
  const { data: notificationsResponse } = useQuery({
    queryKey: queryKeys.notifications.all,
    queryFn: () => notificationsApi.getNotifications({ limit: 50 }),
    enabled: !!accessToken,
  });

  // Подключение к WebSocket
  useEffect(() => {
    if (!accessToken) return;

    const notifSocket = initNotificationsSocket(accessToken);
    setSocket(notifSocket);

    // ========== ОБРАБОТЧИКИ СОБЫТИЙ ==========

    notifSocket.on('connect', () => {
      console.log('✅ Notifications connected');
      setIsConnected(true);
    });

    notifSocket.on('connected', (data: { message: string; userId: string; unreadCount: number }) => {
      console.log('Authenticated notifications:', data);
      setUnreadCount(data.unreadCount);
      
      // Подписываемся на уведомления
      notifSocket.emit('subscribe');
    });

    notifSocket.on('disconnect', () => {
      console.log('❌ Notifications disconnected');
      setIsConnected(false);
    });

    notifSocket.on('error', (error) => {
      console.error('Notifications error:', error);
    });

    // Новое уведомление
    notifSocket.on('notification', (notification: AppNotification) => {  // ← используем AppNotification
      console.log('🔔 New notification:', notification);

      // Добавляем в кэш
      queryClient.setQueryData<AppNotification[]>(
        queryKeys.notifications.list(),
        (old = []) => [notification, ...old]
      );

      // Увеличиваем счётчик
      setUnreadCount((prev) => prev + 1);

      // Показываем toast (простая версия)
      const icon = getNotificationIcon(notification.type);
      toast(
        `${icon} ${notification.title}`,
        {
          duration: 5000,
          position: 'top-right',
          style: {
            minWidth: '300px',
          },
        }
      );

      // Воспроизводим звук
      playNotificationSound();

      // Браузерное уведомление (если разрешено)
      if ('Notification' in window && window.Notification.permission === 'granted') {
        const browserNotif = new window.Notification(notification.title, {
          body: notification.message,
          icon: '/logo.png',
          badge: '/logo.png',
          tag: notification.id,
        });

        // Переход при клике на уведомление
        browserNotif.onclick = () => {
          window.focus();
          if (notification.entityType === 'ticket' && notification.entityId) {
            window.location.href = `/client/tickets/${notification.entityId}`;
          }
        };
      }
    });

    // Обновление счётчика
    notifSocket.on('unread-count', (data: { count: number }) => {
      console.log('Unread count updated:', data.count);
      setUnreadCount(data.count);
    });

    return () => {
      // Не отключаем socket полностью
    };
  }, [accessToken, queryClient]);

  // ========== MUTATIONS ==========

  const markAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      setUnreadCount((prev) => Math.max(0, prev - 1));
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      setUnreadCount(0);
      toast.success('Все уведомления прочитаны');
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: notificationsApi.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });

  // ========== МЕТОДЫ ==========

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('Браузер не поддерживает уведомления');
      return;
    }

    if (window.Notification.permission === 'default') {
      const permission = await window.Notification.requestPermission();
      if (permission === 'granted') {
        toast.success('Уведомления включены');
      }
    }
  }, []);

  return {
    notifications: notificationsResponse?.data || [],
    unreadCount,
    isConnected,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    deleteNotification: deleteNotificationMutation.mutate,
    requestPermission,
  };
};

// ========== УТИЛИТЫ ==========

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

const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 600;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  } catch (error) {
    // Игнорируем
  }
};
