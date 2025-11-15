// Базовые типы
export type UUID = string;

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Сортировка (as const вместо enum)
export const SortOrder = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

export interface SortParams {
  field: string;
  order: SortOrder;
}

// Фильтры
export interface DateRangeFilter {
  from?: string;
  to?: string;
}
