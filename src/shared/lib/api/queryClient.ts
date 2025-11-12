 import { QueryClient } from '@tanstack/react-query';

const CACHE_TIME = {
  SHORT: 30 * 1000, // 30 секунд
  MEDIUM: 5 * 60 * 1000, // 5 минут
  LONG: 30 * 60 * 1000, // 30 минут
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_TIME.MEDIUM,
      gcTime: CACHE_TIME.LONG, // В v5 это заменило cacheTime
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
