import { api as apiClient } from '@/shared/lib/api/apiClient';
import type { 
  Notification,
  NotificationFilters, 
  NotificationsResponse 
} from '../types/notifications.types';

export const notificationsApi = {
  /**
   * Получить список уведомлений
   */
  getNotifications: async (filters?: NotificationFilters): Promise<NotificationsResponse> => {
    const params = new URLSearchParams();

    if (filters?.unreadOnly) params.append('unreadOnly', 'true');
    if (filters?.type) params.append('type', filters.type);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const query = params.toString();
    const url = `/notifications${query ? `?${query}` : ''}`;

    const response = await apiClient.get<NotificationsResponse>(url);
    return response.data; // ← Важно!
  },

  /**
   * Получить количество непрочитанных уведомлений
   */
  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await apiClient.get<{ count: number }>('/notifications/unread-count');
    return response.data; // ← Важно!
  },

  /**
   * Отметить уведомление как прочитанное
   */
  markAsRead: async (id: string): Promise<Notification> => {
    const response = await apiClient.post<Notification>(`/notifications/${id}/read`);
    return response.data; // ← Важно!
  },

  /**
   * Отметить все уведомления как прочитанные
   */
  markAllAsRead: async (): Promise<{ updated: number }> => {
    const response = await apiClient.post<{ updated: number }>('/notifications/mark-all-read');
    return response.data; // ← Важно!
  },

  /**
   * Удалить уведомление
   */
  deleteNotification: async (id: string): Promise<void> => {
    await apiClient.delete(`/notifications/${id}`);
    // Для void не нужно возвращать response.data
  },

  /**
   * Удалить все уведомления
   */
  deleteAllNotifications: async (): Promise<{ deleted: number }> => {
    const response = await apiClient.delete<{ deleted: number }>('/notifications');
    return response.data; // ← Важно!
  },
};
