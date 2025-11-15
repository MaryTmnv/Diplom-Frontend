import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ticketsApi } from '../api/ticketsApi';
import { queryKeys } from '@/shared/lib/api/queryClient';
import { CreateTicketDto } from '../types/tickets.types';

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateTicketDto) => ticketsApi.createTicket(data),
    onSuccess: (ticket) => {
      // Инвалидируем список заявок
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.all });
      
      toast.success(`Заявка ${ticket.number} создана!`);
      
      // Редирект на детали заявки
      navigate(`/client/tickets/${ticket.id}`);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Ошибка создания заявки';
      toast.error(message);
    },
  });
};
