import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ticketsApi } from '../api/ticketsApi';
import { queryKeys } from '@/shared/lib/api/queryClient';
import type { 
  Ticket,
  UpdateTicketPriorityDto, 
  UpdateTicketStatusDto 
} from '../types/tickets.types';

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<Ticket, Error, { id: string; data: UpdateTicketStatusDto }>({
    mutationFn: ({ id, data }) => ticketsApi.updateTicketStatus(id, data),
    onSuccess: (ticket) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.detail(ticket.id) });
      toast.success('Статус обновлён');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Ошибка обновления статуса');
    },
  });
};

export const useUpdateTicketPriority = () => {
  const queryClient = useQueryClient();

  return useMutation<Ticket, Error, { id: string; data: UpdateTicketPriorityDto }>({
    mutationFn: ({ id, data }) => ticketsApi.updateTicketPriority(id, data),
    onSuccess: (ticket) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.detail(ticket.id) });
      toast.success('Приоритет обновлён');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Ошибка обновления приоритета');
    },
  });
};

export const useAssignTicket = () => {
  const queryClient = useQueryClient();

  return useMutation<Ticket, Error, { id: string; operatorId?: string }>({
    mutationFn: ({ id, operatorId }) => ticketsApi.assignTicket(id, operatorId),
    onSuccess: (ticket) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.detail(ticket.id) });
      toast.success('Заявка назначена');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Ошибка назначения заявки');
    },
  });
};
