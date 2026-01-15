import { useQuery } from '@tanstack/react-query';
import { ticketsApi } from '../api/ticketsApi';
import { queryKeys } from '@/shared/lib/api/queryClient';
import type { Ticket, TicketFilters } from '../types/tickets.types';
import type { PaginatedResponse } from '@/shared/types/api.types';

export const useQueue = (filters?: TicketFilters) => {
  const result = useQuery<PaginatedResponse<Ticket>>({
    queryKey: queryKeys.tickets.queue(filters),
    queryFn: async () => {
      console.log('🔄 useQueue: Starting fetch with filters:', filters);
      try {
        const data = await ticketsApi.getQueue(filters);
        console.log('✅ useQueue: Data received:', {
          data,
          dataType: typeof data,
          hasData: !!data?.data,
          dataLength: data?.data?.length,
          meta: data?.meta,
        });
        return data;
      } catch (error) {
        console.error('❌ useQueue: Error fetching queue:', error);
        throw error;
      }
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });

  console.log('🎣 useQueue: Hook result:', {
    data: result.data,
    dataExists: !!result.data,
    dataDataExists: !!result.data?.data,
    dataLength: result.data?.data?.length,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    error: result.error,
    status: result.status,
  });

  return result;
};
