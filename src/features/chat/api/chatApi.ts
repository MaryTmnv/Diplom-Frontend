import { api } from '@/shared/lib/api/apiClient';
import { Message, SendMessageDto } from '../types/message.types';

export const chatApi = {
  // Получить сообщения заявки
  getMessages: async (ticketId: string): Promise<Message[]> => {
    return api.get<Message[]>(`/tickets/${ticketId}/messages`);
  },

  // Отправить сообщение (через REST, для fallback)
  sendMessage: async (ticketId: string, data: SendMessageDto): Promise<Message> => {
    return api.post<Message>(`/tickets/${ticketId}/messages`, data);
  },

  // Отметить сообщение как прочитанное
  markAsRead: async (ticketId: string, messageId: string): Promise<void> => {
    return api.patch<void>(`/tickets/${ticketId}/messages/${messageId}/read`);
  },

  // Количество непрочитанных
  getUnreadCount: async (ticketId: string): Promise<{ count: number }> => {
    return api.get<{ count: number }>(`/tickets/${ticketId}/messages/unread-count`);
  },
};
