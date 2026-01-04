import { api as apiClient } from '@/shared/lib/api/apiClient';
import type { Message, SendMessageDto } from '../types/message.types';

export const chatApi = {
  /**
   * Получить сообщения заявки
   */
  getMessages: async (ticketId: string): Promise<Message[]> => {
    const response = await apiClient.get<Message[]>(`/tickets/${ticketId}/messages`);
    return response.data; // ← Важно!
  },

  /**
   * Отправить сообщение (через REST, для fallback)
   */
  sendMessage: async (ticketId: string, data: SendMessageDto): Promise<Message> => {
    const response = await apiClient.post<Message>(`/tickets/${ticketId}/messages`, data);
    return response.data; // ← Важно!
  },

  /**
   * Отметить сообщение как прочитанное
   */
  markAsRead: async (ticketId: string, messageId: string): Promise<void> => {
    await apiClient.patch(`/tickets/${ticketId}/messages/${messageId}/read`);
    // Для void не нужно возвращать response.data
  },

  /**
   * Количество непрочитанных сообщений
   */
  getUnreadCount: async (ticketId: string): Promise<{ count: number }> => {
    const response = await apiClient.get<{ count: number }>(`/tickets/${ticketId}/messages/unread-count`);
    return response.data; // ← Важно!
  },

  /**
   * Загрузить вложение
   */
  uploadAttachment: async (file: File): Promise<{ id: string; url: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<{ id: string; url: string }>(
      '/attachments/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};
