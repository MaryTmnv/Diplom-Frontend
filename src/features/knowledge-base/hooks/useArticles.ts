import { useQuery } from '@tanstack/react-query';
import { ArticleFilters } from '../types/article.types';
import { queryKeys } from '@/shared/lib/api/queryClient';
import { articlesApi } from '../api/articleApi';

export const useArticles = (filters?: ArticleFilters) => {
  return useQuery({
    queryKey: queryKeys.articles.list(filters),
    queryFn: () => articlesApi.getArticles(filters),
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};
