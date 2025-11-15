import { api } from '@/shared/lib/api/apiClient';
import { CreateTicketDto, Ticket, TicketFilters, TicketsResponse, TicketDetail, RateTicketDto, UpdateTicketStatusDto, UpdateTicketPriorityDto, EscalateTicketDto, TicketEvent } from '../types/tickets.types';


export const ticketsApi = {
  // ========== КЛИЕНТ ==========

  // Создать заявку
  createTicket: async (data: CreateTicketDto): Promise<Ticket> => {
    return api.post<Ticket>('/tickets', data);
  },

  // Мои заявки
  getMyTickets: async (filters?: TicketFilters): Promise<TicketsResponse> => {
    const params = new URLSearchParams();

    if (filters?.status) {
      filters.status.forEach((s) => params.append('status[]', s));
    }
    if (filters?.priority) {
      filters.priority.forEach((p) => params.append('priority[]', p));
    }
    if (filters?.category) {
      filters.category.forEach((c) => params.append('category[]', c));
    }
    if (filters?.search) params.append('search', filters.search);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    return api.get<TicketsResponse>(`/tickets?${params.toString()}`);
  },

  // Детали заявки
  getTicketById: async (id: string): Promise<TicketDetail> => {
    return api.get<TicketDetail>(`/tickets/${id}`);
  },

  // Оценить заявку
  rateTicket: async (id: string, rating: RateTicketDto): Promise<void> => {
    return api.post<void>(`/tickets/${id}/rate`, rating);
  },

  // ========== ОПЕРАТОР ==========

  // Очередь заявок
  getQueue: async (): Promise<Ticket[]> => {
    return api.get<Ticket[]>('/tickets/queue');
  },

  // Мои активные заявки
  getMyActiveTickets: async (): Promise<Ticket[]> => {
    return api.get<Ticket[]>('/tickets/my-active');
  },

  // Назначить заявку на себя
  assignTicket: async (id: string, operatorId?: string): Promise<Ticket> => {
    return api.post<Ticket>(`/tickets/${id}/assign`, { operatorId });
  },

  // Изменить статус
  updateTicketStatus: async (
    id: string,
    data: UpdateTicketStatusDto
  ): Promise<Ticket> => {
    return api.patch<Ticket>(`/tickets/${id}/status`, data);
  },

  // Изменить приоритет
  updateTicketPriority: async (
    id: string,
    data: UpdateTicketPriorityDto
  ): Promise<Ticket> => {
    return api.patch<Ticket>(`/tickets/${id}/priority`, data);
  },

  // Эскалировать заявку
  escalateTicket: async (id: string, data: EscalateTicketDto): Promise<Ticket> => {
    return api.post<Ticket>(`/tickets/${id}/escalate`, data);
  },

  // Добавить внутреннюю заметку
  addInternalNote: async (id: string, content: string): Promise<void> => {
    return api.post<void>(`/tickets/${id}/notes`, { content });
  },

  // ========== ОБЩЕЕ ==========

  // История заявки
  getTicketHistory: async (id: string): Promise<TicketEvent[]> => {
    return api.get<TicketEvent[]>(`/tickets/${id}/history`);
  },

  // Умные подсказки (для операторов)
  getSuggestions: async (id: string): Promise<{
    similarTickets: Ticket[];
    articles: any[];
  }> => {
    return api.get(`/tickets/${id}/suggestions`);
  },
};
