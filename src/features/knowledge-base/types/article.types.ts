import { PaginatedResponse } from '@/shared/types/api.types';

export enum ArticleCategory {
  CARDS = 'CARDS',
  DEPOSITS = 'DEPOSITS',
  LOANS = 'LOANS',
  MOBILE_APP = 'MOBILE_APP',
  PAYMENTS = 'PAYMENTS',
  SECURITY = 'SECURITY',
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: ArticleCategory;
  views: number;
  helpfulCount: number;
  notHelpfulCount: number;
  helpfulPercentage: number;
  readingTime: number; // минуты
  createdAt: string;
  updatedAt?: string;
}

export interface ArticleDetail extends Article {
  content: string; // Markdown
  isPublished: boolean;
  relatedArticles: Article[];
  userRating?: boolean | null; // true = полезно, false = не полезно, null = не оценивал
}

export interface ArticleFilters {
  category?: ArticleCategory;
  search?: string;
  sortBy?: 'popular' | 'recent' | 'helpful';
  page?: number;
  limit?: number;
}

export type ArticlesResponse = PaginatedResponse<Article>;

export interface CategoryStats {
  category: ArticleCategory;
  count: number;
  title: string;
}
