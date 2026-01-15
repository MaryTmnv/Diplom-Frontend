import { api as apiClient } from '@/shared/lib/api/apiClient';
import type { 
  Ticket, 
  TicketDetail, 
  TicketFilters,
  CreateTicketDto,
  UpdateTicketStatusDto,
  UpdateTicketPriorityDto,
  TicketEvent,
  RatingDto,
  EscalateDto,
} from '../types/tickets.types';
import { PaginatedResponse } from '@/shared/types/api.types';

export const ticketsApi = {
  /**
   * Получить очередь заявок (для операторов)
   */
  getQueue: async (filters?: TicketFilters): Promise<PaginatedResponse<Ticket>> => {
    console.log('🌐 ticketsApi.getQueue: Called with filters:', filters);
    
    const params = new URLSearchParams();
    

    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));

    const query = params.toString();
    const url = `/tickets/queue${query ? `?${query}` : ''}`;

    console.log('🌐 ticketsApi.getQueue: Making request to:', url);

    try {
      const response = await apiClient.get<Ticket[]>(url); // ← Изменили тип!
      
      console.log('✅ ticketsApi.getQueue: Response received:', {
        status: response.status,
        data: response.data,
        dataType: typeof response.data,
        isArray: Array.isArray(response.data),
        dataLength: response.data?.length,
      });

      // ✅ Оборачиваем массив в PaginatedResponse
      const paginatedResponse: PaginatedResponse<Ticket> = {
        data: response.data,
        meta: {
          total: response.data.length,
          page: filters?.page || 1,
          limit: filters?.limit || 20,
          totalPages: 1,
          hasNext: false,  // добавьте реальные значения
           hasPrev: false,  // добавьте реальные значения

        },
      };

      console.log('✅ Wrapped response:', paginatedResponse);

      return paginatedResponse;
    } catch (error) {
      console.error('❌ ticketsApi.getQueue: Request failed:', error);
      throw error;
    }
  },

  /**
   * Получить активные заявки оператора (возвращает массив)
   */
  getMyActiveTickets: async (): Promise<Ticket[]> => {
    const response = await apiClient.get<Ticket[]>('/tickets/my-active');
    return response.data;
  },

  /**
   * Получить мои заявки (для клиента) с пагинацией
   */
  getMyTickets: async (filters?: TicketFilters): Promise<PaginatedResponse<Ticket>> => {
    const params = new URLSearchParams();

    if (filters?.status) {
      filters.status.forEach((s) => params.append('status', s));
    }
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const query = params.toString();
    const url = `/tickets${query ? `?${query}` : ''}`;

    const response = await apiClient.get<PaginatedResponse<Ticket>>(url);
    return response.data;
  },

  /**
   * Получить детали заявки по ID
   */
  getTicketById: async (id: string): Promise<TicketDetail> => {
    const response = await apiClient.get<TicketDetail>(`/tickets/${id}`);
    return response.data;
  },

  /**
   * Создать новую заявку
   */
  createTicket: async (data: CreateTicketDto): Promise<Ticket> => {
    const response = await apiClient.post<Ticket>('/tickets', data);
    return response.data;
  },

  /**
   * Обновить статус заявки
   */
  updateTicketStatus: async (id: string, data: UpdateTicketStatusDto): Promise<Ticket> => {
    const response = await apiClient.patch<Ticket>(`/tickets/${id}/status`, data);
    return response.data;
  },

  /**
   * Обновить приоритет заявки
   */
  updateTicketPriority: async (id: string, data: UpdateTicketPriorityDto): Promise<Ticket> => {
    const response = await apiClient.patch<Ticket>(`/tickets/${id}/priority`, data);
    return response.data;
  },

  /**
   * Взять заявку в работу
   */
  assignTicket: async (id: string, operatorId?: string): Promise<Ticket> => {
    const response = await apiClient.post<Ticket>(
      `/tickets/${id}/assign`,
      operatorId ? { operatorId } : undefined
    );
    return response.data;
  },

  /**
   * Эскалировать заявку
   */
  escalateTicket: async (id: string, data: EscalateDto): Promise<Ticket> => {
    const response = await apiClient.post<Ticket>(`/tickets/${id}/escalate`, data);
    return response.data;
  },

  /**
   * Добавить внутреннюю заметку
   */
  addInternalNote: async (id: string, note: string): Promise<void> => {
    await apiClient.post(`/tickets/${id}/notes`, { content: note });
  },

  /**
   * Получить историю заявки
   */
  getTicketHistory: async (id: string): Promise<TicketEvent[]> => {
    const response = await apiClient.get<TicketEvent[]>(`/tickets/${id}/history`);
    return response.data;
  },

  /**
   * Получить рекомендуемые статьи для заявки
   */
  getSuggestedArticles: async (ticketId: string): Promise<any[]> => {
    const response = await apiClient.get<any[]>(`/tickets/${ticketId}/suggested-articles`);
    return response.data;
  },

  /**
   * Получить похожие заявки
   */
  getSimilarTickets: async (ticketId: string): Promise<Ticket[]> => {
    const response = await apiClient.get<Ticket[]>(`/tickets/${ticketId}/similar`);
    return response.data;
  },

  /**
   * Оценить заявку (для клиента)
   */
  rateTicket: async (id: string, rating: RatingDto): Promise<void> => {
    await apiClient.post(`/tickets/${id}/rate`, rating);
  },
};
