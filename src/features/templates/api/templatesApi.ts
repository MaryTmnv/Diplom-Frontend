import { api } from '@/shared/lib/api/apiClient';
import {
  Template,
  TemplatesResponse,
  TemplateFilters,
  UseTemplateDto,
  UseTemplateResponse,
} from '../types/template.types';

export const templatesApi = {
  // Список шаблонов
  getTemplates: async (filters?: TemplateFilters): Promise<TemplatesResponse> => {
    const params = new URLSearchParams();

    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.activeOnly !== undefined) params.append('activeOnly', filters.activeOnly.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    return api.get<TemplatesResponse>(`/templates?${params.toString()}`);
  },

  // Шаблоны по категории
  getTemplatesByCategory: async (category: string): Promise<Template[]> => {
    return api.get<Template[]>(`/templates/category/${category}`);
  },

  // Популярные шаблоны
  getPopularTemplates: async (limit: number = 5): Promise<Template[]> => {
    return api.get<Template[]>(`/templates/popular?limit=${limit}`);
  },

  // Использовать шаблон (подставить переменные)
  useTemplate: async (id: string, data: UseTemplateDto): Promise<UseTemplateResponse> => {
    return api.post<UseTemplateResponse>(`/templates/${id}/use`, data);
  },

  // Оценить шаблон
  rateTemplate: async (id: string, rating: number): Promise<{ templateId: string; newRating: number }> => {
    return api.post(`/templates/${id}/rate`, { rating });
  },
};
