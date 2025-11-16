import { useQuery } from '@tanstack/react-query';
import { ticketsApi } from '../api/ticketsApi';
import { queryKeys } from '@/shared/lib/api/queryClient';

export const useMyActiveTickets = () => {
  return useQuery({
    queryKey: queryKeys.tickets.myActive,
    queryFn: () => ticketsApi.getMyActiveTickets(),
    refetchInterval: 15000, // Обновляем каждые 15 секунд
    staleTime: 5000,
  });
};
