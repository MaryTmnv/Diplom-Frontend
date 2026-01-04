import { useQuery } from '@tanstack/react-query';
import { ticketsApi } from '../api/ticketsApi';
import { queryKeys } from '@/shared/lib/api/queryClient';
import type { Ticket, TicketFilters } from '../types/tickets.types';
import type { PaginatedResponse } from '@/shared/types/api.types';

export const useQueue = (filters?: TicketFilters) => {
  return useQuery<PaginatedResponse<Ticket>>({
    queryKey: queryKeys.tickets.queue(filters),
    queryFn: () => ticketsApi.getQueue(filters), 
    staleTime: 30000, // 30 секунд
    refetchInterval: 60000, // Обновлять каждую минуту
  });
};
