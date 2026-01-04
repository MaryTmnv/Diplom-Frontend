import { useQuery } from '@tanstack/react-query';
import { ticketsApi } from '../api/ticketsApi';
import { queryKeys } from '@/shared/lib/api/queryClient';
import type { Ticket } from '../types/tickets.types';

export const useMyActiveTickets = () => {
  return useQuery<Ticket[]>({
    queryKey: queryKeys.tickets.myActive(), 
    queryFn: () => ticketsApi.getMyActiveTickets(),
    refetchInterval: 15000, // Обновляем каждые 15 секунд
    staleTime: 5000,
  });
};
