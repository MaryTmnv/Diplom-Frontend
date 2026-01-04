import { api as apiClient } from '@/shared/lib/api/apiClient';
import type { 
  Article, 
  ArticleDetail, 
  ArticleFilters,
  ArticlesResponse,
  CategoryStats 
} from '../types/article.types';

export const articlesApi = {
  /**
   * Получить список статей
   */
  getArticles: async (filters?: ArticleFilters): Promise<ArticlesResponse> => {
    const params = new URLSearchParams();

    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const query = params.toString();
    const url = `/articles${query ? `?${query}` : ''}`;

    const response = await apiClient.get<ArticlesResponse>(url);
    return response.data; // ← Важно! Возвращаем response.data
  },

  /**
   * Получить статью по slug
   */
  getArticleBySlug: async (slug: string): Promise<ArticleDetail> => {
    const response = await apiClient.get<ArticleDetail>(`/articles/${slug}`);
    return response.data; // ← Важно!
  },

  /**
   * Поиск статей
   */
  searchArticles: async (query: string): Promise<Article[]> => {
    const response = await apiClient.get<Article[]>(
      `/articles/search?q=${encodeURIComponent(query)}`
    );
    return response.data; // ← Важно!
  },

  /**
   * Получить популярные статьи
   */
  getPopularArticles: async (limit: number = 6): Promise<Article[]> => {
    const response = await apiClient.get<Article[]>(`/articles/popular?limit=${limit}`);
    return response.data; // ← Важно!
  },

  /**
   * Получить статьи по категории
   */
  getArticlesByCategory: async (category: string): Promise<Article[]> => {
    const response = await apiClient.get<Article[]>(`/articles/category/${category}`);
    return response.data; // ← Важно!
  },

  /**
   * Получить статистику по категориям
   */
  getCategoryStats: async (): Promise<CategoryStats[]> => {
    const response = await apiClient.get<CategoryStats[]>('/articles/categories');
    return response.data; // ← Важно!
  },

  /**
   * Оценить статью (полезна/не полезна)
   */
  rateArticle: async (id: string, helpful: boolean): Promise<void> => {
    await apiClient.post(`/articles/${id}/rate`, { helpful });
    // Для void не нужно возвращать response.data
  },

  /**
   * Увеличить счетчик просмотров
   */
  incrementViews: async (id: string): Promise<void> => {
    await apiClient.post(`/articles/${id}/views`);
  },
};
