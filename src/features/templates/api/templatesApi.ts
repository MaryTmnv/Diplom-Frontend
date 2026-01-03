import { apiClient } from '@/shared/lib/api/apiClient';
import type { 
  Template, 
  TemplateFilters, 
  TemplatesResponse,
  UseTemplateDto,
  UseTemplateResponse,
} from '../types/template.types';

export const templatesApi = {
  /**
   * Получить список шаблонов с фильтрацией и пагинацией
   */
  getTemplates: async (filters?: TemplateFilters): Promise<TemplatesResponse> => {
    const params = new URLSearchParams();
    
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.activeOnly !== undefined) params.append('activeOnly', String(filters.activeOnly));
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));

    const query = params.toString();
    const url = `/templates${query ? `?${query}` : ''}`;

    const response = await apiClient.get<TemplatesResponse>(url);
    return response.data;
  },

  /**
   * Получить популярные шаблоны (без пагинации)
   */
  getPopularTemplates: async (limit: number = 5): Promise<Template[]> => {
    const response = await apiClient.get<Template[]>(`/templates/popular?limit=${limit}`);
    return response.data;
  },

  /**
   * Получить шаблоны по категории
   */
  getTemplatesByCategory: async (category: string): Promise<Template[]> => {
    const response = await apiClient.get<Template[]>(`/templates/category/${category}`);
    return response.data;
  },

  /**
   * Получить шаблон по ID
   */
  getTemplateById: async (id: string): Promise<Template> => {
    const response = await apiClient.get<Template>(`/templates/${id}`);
    return response.data;
  },

  /**
   * Использовать шаблон с подстановкой переменных
   */
  useTemplate: async (id: string, data: UseTemplateDto): Promise<UseTemplateResponse> => {
    const response = await apiClient.post<UseTemplateResponse>(`/templates/${id}/use`, data);
    return response.data;
  },

  /**
   * Увеличить счётчик использования (простой вариант)
   */
  incrementUsage: async (id: string): Promise<void> => {
    await apiClient.post(`/templates/${id}/increment-usage`);
  },

  /**
   * Оценить шаблон
   */
  rateTemplate: async (id: string, rating: number): Promise<void> => {
    await apiClient.post<void>(`/templates/${id}/rate`, { rating });
  },
};
