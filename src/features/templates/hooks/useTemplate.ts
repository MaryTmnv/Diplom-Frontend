import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { templatesApi } from '../api/templatesApi';
import { TemplateFilters, UseTemplateDto } from '../types/template.types';
import { queryKeys } from '@/shared/lib/api/queryClient';
import toast from 'react-hot-toast';

export const useTemplates = (filters?: TemplateFilters) => {
  return useQuery({
    queryKey: queryKeys.templates.list(filters),
    queryFn: () => templatesApi.getTemplates(filters),
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};

export const usePopularTemplates = (limit: number = 5) => {
  return useQuery({
    queryKey: ['templates', 'popular', limit],
    queryFn: () => templatesApi.getPopularTemplates(limit),
    staleTime: 5 * 60 * 1000,
  });
};

export const useTemplatesByCategory = (category: string) => {
  return useQuery({
    queryKey: ['templates', 'category', category],
    queryFn: () => templatesApi.getTemplatesByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUseTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UseTemplateDto }) =>
      templatesApi.useTemplate(id, data),
    onSuccess: () => {
      // Инвалидируем список шаблонов (обновится usageCount)
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
    },
  });
};

export const useRateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, rating }: { id: string; rating: number }) =>
      templatesApi.rateTemplate(id, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
      toast.success('Спасибо за оценку!');
    },
  });
};
