import { useQuery } from '@tanstack/react-query';
import { ticketsApi } from '../api/ticketsApi';
import { queryKeys } from '@/shared/lib/api/queryClient';
import { TicketFilters } from '../types/tickets.types';

export const useTickets = (filters?: TicketFilters) => {
  return useQuery({
    queryKey: queryKeys.tickets.list(filters),
    queryFn: () => ticketsApi.getMyTickets(filters),
    staleTime: 30000, // 30 секунд
  });
};
