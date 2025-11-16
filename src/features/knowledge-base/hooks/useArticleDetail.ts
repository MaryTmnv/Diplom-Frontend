import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/lib/api/queryClient';
import toast from 'react-hot-toast';
import { articlesApi } from '../api/articleApi';

export const useArticleDetail = (slug: string) => {
  return useQuery({
    queryKey: queryKeys.articles.detail(slug),
    queryFn: () => articlesApi.getArticleBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

export const useRateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, helpful }: { id: string; helpful: boolean }) =>
      articlesApi.rateArticle(id, helpful),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
      toast.success(variables.helpful ? 'Спасибо за оценку! 👍' : 'Спасибо за отзыв');
    },
  });
};
