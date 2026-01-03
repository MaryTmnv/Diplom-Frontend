import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { templatesApi } from '../api/templatesApi';
import { queryKeys } from '@/shared/lib/api/queryClient';
import type { 
  Template, 
  TemplateFilters, 
  TemplatesResponse,
  UseTemplateDto,
  UseTemplateResponse,
} from '../types/template.types';
import toast from 'react-hot-toast';

/**
 * Получить список шаблонов с фильтрацией и пагинацией
 */
export const useTemplates = (filters?: TemplateFilters) => {
  return useQuery<TemplatesResponse>({
    queryKey: queryKeys.templates.list(filters),
    queryFn: () => templatesApi.getTemplates(filters),
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};

/**
 * Получить популярные шаблоны (без пагинации)
 */
export const usePopularTemplates = (limit: number = 5) => {
  return useQuery<Template[]>({
    queryKey: queryKeys.templates.popular(limit),
    queryFn: () => templatesApi.getPopularTemplates(limit),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Получить шаблоны по категории
 */
export const useTemplatesByCategory = (category: string) => {
  return useQuery<Template[]>({
    queryKey: queryKeys.templates.byCategory(category),
    queryFn: () => templatesApi.getTemplatesByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Получить один шаблон по ID
 */
export const useTemplate = (id: string) => {
  return useQuery<Template>({
    queryKey: queryKeys.templates.detail(id),
    queryFn: () => templatesApi.getTemplateById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Использовать шаблон с подстановкой переменных
 */
export const useUseTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation<UseTemplateResponse, Error, { id: string; data: UseTemplateDto }>({
    mutationFn: ({ id, data }) => templatesApi.useTemplate(id, data),
    onSuccess: (_, variables) => {
      // Инвалидируем список шаблонов (обновится usageCount)
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.detail(variables.id) });
    },
  });
};

/**
 * Увеличить счётчик использования шаблона (простой вариант)
 */
export const useIncrementTemplateUsage = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (templateId: string) => templatesApi.incrementUsage(templateId),
    onSuccess: () => {
      // Инвалидируем список шаблонов (обновится usageCount)
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
    },
  });
};

/**
 * Оценить шаблон
 */
export const useRateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: string; rating: number }>({
    mutationFn: ({ id, rating }) => templatesApi.rateTemplate(id, rating),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.detail(variables.id) });
      toast.success('Спасибо за оценку!');
    },
    onError: () => {
      toast.error('Не удалось оценить шаблон');
    },
  });
};
