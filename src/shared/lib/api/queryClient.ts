import { QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 минута
      gcTime: 5 * 60 * 1000, // 5 минут (новое название для cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
      onError: (error: any) => {
        // Глобальная обработка ошибок мутаций
        const message = error?.response?.data?.message || 'Произошла ошибка';
        
        // Не показываем toast для 401 (это обработает interceptor)
        if (error?.response?.status !== 401) {
          toast.error(message);
        }
      },
    },
  },
});

// Утилиты для работы с кэшем
export const queryKeys = {
  // Auth
  auth: {
    user: ['auth', 'user'] as const,
    session: ['auth', 'session'] as const,
  },
  
  // Tickets
  tickets: {
    all: ['tickets'] as const,
    list: (filters?: unknown) => ['tickets', 'list', filters] as const,
    detail: (id: string) => ['tickets', 'detail', id] as const,
    history: (id: string) => ['tickets', 'history', id] as const,
    queue: ['tickets', 'queue'] as const,  // ← добавили
    myActive: ['tickets', 'my-active'] as const,  // ← добавили
  },

  // Messages
  messages: {
    all: ['messages'] as const,
    list: (ticketId: string) => ['messages', 'list', ticketId] as const,
  },

  // Notifications - ДОБАВЛЕНО
  notifications: {
    all: ['notifications'] as const,
    list: (filters?: unknown) => ['notifications', 'list', filters] as const,
    unreadCount: ['notifications', 'unread-count'] as const,
  },

  // Articles
  articles: {
    all: ['articles'] as const,
    list: (filters?: unknown) => ['articles', 'list', filters] as const,
    detail: (id: string) => ['articles', 'detail', id] as const,
    search: (query: string) => ['articles', 'search', query] as const,
    popular: ['articles', 'popular'] as const,
  },

  // Templates
  templates: {
    all: ['templates'] as const,
    list: (filters?: unknown) => ['templates', 'list', filters] as const,
  },

  // Analytics
  analytics: {
    overview: (period: string) => ['analytics', 'overview', period] as const,
    performance: (period: string) => ['analytics', 'performance', period] as const,
  },
} as const;
