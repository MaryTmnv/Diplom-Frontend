import { api as apiClient } from '@/shared/lib/api/apiClient';
import type { Message, SendMessageDto } from '../types/message.types';

export const chatApi = {
  /**
   * Получить сообщения заявки
   */
  getMessages: async (ticketId: string): Promise<Message[]> => {
    const response = await apiClient.get<Message[]>(`/tickets/${ticketId}/messages`);
    return response.data;
  },

  /**
   * Отправить сообщение (через REST, для fallback)
   */
  sendMessage: async (ticketId: string, data: SendMessageDto): Promise<Message> => {
    const response = await apiClient.post<Message>(`/tickets/${ticketId}/messages`, data);
    return response.data;
  },

  /**
   * Отметить сообщение как прочитанное
   */
  markAsRead: async (ticketId: string, messageId: string): Promise<Message> => {
    const response = await apiClient.patch<Message>(`/tickets/${ticketId}/messages/${messageId}/read`);
    return response.data; // ✅ Backend возвращает обновлённое сообщение
  },

  /**
   * Отметить несколько сообщений как прочитанные
   */
  markMultipleAsRead: async (ticketId: string, messageIds: string[]): Promise<{ updated: number }> => {
    const response = await apiClient.post<{ updated: number }>(
      `/tickets/${ticketId}/messages/mark-read`,
      { messageIds }
    );
    return response.data;
  },

  /**
   * Количество непрочитанных сообщений
   */
  getUnreadCount: async (ticketId: string): Promise<number> => {
    const response = await apiClient.get<number>(`/tickets/${ticketId}/messages/unread-count`);
    return response.data; // ✅ Backend возвращает просто число
  },

  /**
   * Загрузить вложение
   */
  uploadAttachment: async (file: File): Promise<{ id: string; url: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<{ id: string; url: string }>(
      '/files/upload', // ✅ Исправлен путь
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
