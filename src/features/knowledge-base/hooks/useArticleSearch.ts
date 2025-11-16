import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/shared/hooks/useDebounce';

import { queryKeys } from '@/shared/lib/api/queryClient';
import { articlesApi } from '../api/articleApi';

export const useArticleSearch = (query: string) => {
  const debouncedQuery = useDebounce(query, 300);

  return useQuery({
    queryKey: queryKeys.articles.search(debouncedQuery),
    queryFn: () => articlesApi.searchArticles(debouncedQuery),
    enabled: debouncedQuery.length >= 3, // Минимум 3 символа
    staleTime: 60000, // 1 минута
  });
};
