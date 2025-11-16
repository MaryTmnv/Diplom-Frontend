import { useQuery } from '@tanstack/react-query';
import { ticketsApi } from '../api/ticketsApi';
import { queryKeys } from '@/shared/lib/api/queryClient';

export const useQueue = () => {
  return useQuery({
    queryKey: queryKeys.tickets.queue,
    queryFn: () => ticketsApi.getQueue(),
    refetchInterval: 30000, // Обновляем каждые 30 секунд
    staleTime: 10000, // 10 секунд
  });
};
