import { api } from '@/shared/lib/api/apiClient';
import {
  Article,
  ArticleDetail,
  ArticlesResponse,
  ArticleFilters,
  CategoryStats,
} from '../types/article.types';

export const articlesApi = {
  // Список статей
  getArticles: async (filters?: ArticleFilters): Promise<ArticlesResponse> => {
    const params = new URLSearchParams();

    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    return api.get<ArticlesResponse>(`/articles?${params.toString()}`);
  },

  // Статья по slug
  getArticleBySlug: async (slug: string): Promise<ArticleDetail> => {
    return api.get<ArticleDetail>(`/articles/${slug}`);
  },

  // Поиск статей
  searchArticles: async (query: string): Promise<Article[]> => {
    return api.get<Article[]>(`/articles/search?q=${encodeURIComponent(query)}`);
  },

  // Популярные статьи
  getPopularArticles: async (limit: number = 6): Promise<Article[]> => {
    return api.get<Article[]>(`/articles/popular?limit=${limit}`);
  },

  // Статьи по категории
  getArticlesByCategory: async (category: string): Promise<Article[]> => {
    return api.get<Article[]>(`/articles/category/${category}`);
  },

  // Статистика по категориям
  getCategoryStats: async (): Promise<CategoryStats[]> => {
    return api.get<CategoryStats[]>('/articles/categories');
  },

  // Оценить статью
  rateArticle: async (id: string, helpful: boolean): Promise<void> => {
    return api.post<void>(`/articles/${id}/rate`, { helpful });
  },
};
