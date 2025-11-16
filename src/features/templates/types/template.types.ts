import { TicketCategory } from '@/features/tickets/types/tickets.types';
import { PaginatedResponse } from '@/shared/types/api.types';

export interface Template {
  id: string;
  title: string;
  content: string;
  category: TicketCategory;
  usageCount: number;
  rating: number; // 0-5
  variables: string[]; // Например: ['name', 'ticketNumber', 'action']
  isActive: boolean;
  createdAt: string;
}

export interface TemplateFilters {
  category?: TicketCategory;
  search?: string;
  activeOnly?: boolean;
  sortBy?: 'popular' | 'recent' | 'rated';
  page?: number;
  limit?: number;
}

export interface UseTemplateDto {
  variables: Record<string, string>;
}

export interface UseTemplateResponse {
  id: string;
  title: string;
  content: string; // Обработанный текст с подставленными переменными
  originalContent: string;
  variables: string[];
  usedVariables: Record<string, string>;
}

export type TemplatesResponse = PaginatedResponse<Template>;
