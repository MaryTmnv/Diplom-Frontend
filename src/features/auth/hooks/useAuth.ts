import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import { queryKeys } from '@/shared/lib/api/queryClient';
import { getRoleBasePath } from '@/shared/lib/utils/roleRedirect';

export const useAuth = () => {
  const navigate = useNavigate();
  const { setUser, setToken, logout: clearAuth } = useAuthStore();

  // Login
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      setToken(response.accessToken);
      setUser(response.user);
      
      toast.success(`Добро пожаловать, ${response.user.firstName}!`);
      
      // Редирект в зависимости от роли
      const redirectPath = getRoleBasePath(response.user.role);
      navigate(redirectPath);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Ошибка входа';
      toast.error(message);
    },
  });

  // Register
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (response) => {
      setToken(response.accessToken);
      setUser(response.user);
      
      toast.success('Регистрация успешна!');
      
      // Редирект в зависимости от роли
      const redirectPath = getRoleBasePath(response.user.role);
      navigate(redirectPath);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Ошибка регистрации';
      toast.error(message);
    },
  });

  // Logout
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuth();
      navigate('/');
      toast.success('Вы вышли из системы');
    },
    onError: () => {
      // Даже если запрос упал, всё равно разлогиниваем
      clearAuth();
      navigate('/');
    },
  });

  // Get current user
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: authApi.getCurrentUser,
    enabled: !!useAuthStore.getState().token,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 минут
  });

  // Forgot password
  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success('Инструкции отправлены на email');
      navigate('/auth/login');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Ошибка восстановления';
      toast.error(message);
    },
  });

  return {
    // Mutations
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    
    // States
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isLoadingUser,
    user,
  };
};
