import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import { queryKeys } from '@/shared/lib/api/queryClient';
import { User } from '@/shared/types/user.types';

export const useUser = () => {
  const { isAuthenticated, setUser } = useAuthStore();

  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: queryKeys.auth.user,
    queryFn: authApi.getCurrentUser,
    enabled: isAuthenticated, // Запрашиваем только если авторизован
    staleTime: 5 * 60 * 1000, // 5 минут
    retry: 1,
  });

  // Обновляем store когда получили данные
  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  return {
    user,
    isLoading,
    error,
  };
};
