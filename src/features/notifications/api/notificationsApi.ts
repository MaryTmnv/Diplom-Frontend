import { api } from '@/shared/lib/api/apiClient';
import { NotificationFilters, NotificationsResponse } from '../types/notifications.types';

export const notificationsApi = {
  // Список уведомлений
  getNotifications: async (filters?: NotificationFilters): Promise<NotificationsResponse> => {
    const params = new URLSearchParams();

    if (filters?.unreadOnly) params.append('unreadOnly', 'true');
    if (filters?.type) params.append('type', filters.type);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    return api.get<NotificationsResponse>(`/notifications?${params.toString()}`);
  },

  // Количество непрочитанных
  getUnreadCount: async (): Promise<{ count: number }> => {
    return api.get<{ count: number }>('/notifications/unread-count');
  },

  // Отметить как прочитанное
  markAsRead: async (id: string): Promise<Notification> => {
    return api.post<Notification>(`/notifications/${id}/read`);
  },

  // Отметить все как прочитанные
  markAllAsRead: async (): Promise<{ updated: number }> => {
    return api.post<{ updated: number }>('/notifications/mark-all-read');
  },

  // Удалить уведомление
  deleteNotification: async (id: string): Promise<void> => {
    return api.delete<void>(`/notifications/${id}`);
  },

  // Удалить все уведомления
  deleteAllNotifications: async (): Promise<{ deleted: number }> => {
    return api.delete<{ deleted: number }>('/notifications');
  },
};
