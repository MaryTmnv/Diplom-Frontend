import { QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 минута
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Произошла ошибка';
        toast.error(message);
      },
    },
  },
});

// Query Keys для типизации и переиспользования
export const queryKeys = {
  // Auth
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },

  // Tickets
  tickets: {
    all: ['tickets'] as const,
    list: (filters?: any) => [...queryKeys.tickets.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.tickets.all, 'detail', id] as const,
    myTickets: () => [...queryKeys.tickets.all, 'my'] as const,
    myActive: () => [...queryKeys.tickets.all, 'my-active'] as const, // ← Добавили!
    queue: (filters?: any) => [...queryKeys.tickets.all, 'queue', filters] as const,
  },


  // Messages
  messages: {
    all: ['messages'] as const,
    list: (ticketId: string) => [...queryKeys.messages.all, 'list', ticketId] as const,
  },

  // Templates
  templates: {
    all: ['templates'] as const,
    list: (filters?: any) => [...queryKeys.templates.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.templates.all, 'detail', id] as const,
    popular: (limit: number) => [...queryKeys.templates.all, 'popular', limit] as const,
    byCategory: (category: string) => [...queryKeys.templates.all, 'category', category] as const,
  },

  // Knowledge Base (Articles)
  articles: {
    all: ['articles'] as const,
    list: (filters?: any) => [...queryKeys.articles.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.articles.all, 'detail', id] as const,
    search: (query: string) => [...queryKeys.articles.all, 'search', query] as const,
    popular: (limit: number) => [...queryKeys.articles.all, 'popular', limit] as const,
  },

  // Chat
  chat: {
    all: ['chat'] as const,
    messages: (ticketId: string) => [...queryKeys.chat.all, 'messages', ticketId] as const,
    unreadCount: (ticketId: string) => [...queryKeys.chat.all, 'unread', ticketId] as const,
  },


  // Analytics
  analytics: {
    all: ['analytics'] as const,
    overview: (period: string) => [...queryKeys.analytics.all, 'overview', period] as const,
    performance: (period: string) => [...queryKeys.analytics.all, 'performance', period] as const,
    topIssues: (period: string, limit?: number) => 
      [...queryKeys.analytics.all, 'top-issues', period, limit] as const,
  },

  // Notifications
  notifications: {
    all: ['notifications'] as const,
    list: () => [...queryKeys.notifications.all, 'list'] as const,
    unreadCount: () => [...queryKeys.notifications.all, 'unread-count'] as const,
  },
};
