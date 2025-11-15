import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setAuth, logout: logoutStore, user, isAuthenticated, refreshToken } = useAuthStore();

  // Логин
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data);
      toast.success(`Добро пожаловать, ${data.user.firstName}!`);
      
      // Редирект в зависимости от роли
      const redirectMap = {
        CLIENT: '/client/dashboard',
        OPERATOR: '/operator/queue',
        SPECIALIST: '/operator/queue',
        MANAGER: '/manager/analytics',
        ADMIN: '/manager/analytics',
      };
      
      navigate(redirectMap[data.user.role] || '/');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Ошибка входа';
      toast.error(message);
    },
  });

  // Регистрация
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuth(data);
      toast.success('Регистрация успешна!');
      navigate('/client/dashboard');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Ошибка регистрации';
      toast.error(message);
    },
  });

  // Выход
  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(refreshToken || ''),
    onSuccess: () => {
      logoutStore();
      queryClient.clear(); // Очищаем весь кэш
      toast.success('Вы вышли из системы');
      navigate('/auth/login');
    },
  });

  // Забыли пароль
  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success('Письмо с инструкциями отправлено на ваш email');
    },
  });

  // Сброс пароля
  const resetPasswordMutation = useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authApi.resetPassword(token, password),
    onSuccess: () => {
      toast.success('Пароль успешно изменён');
      navigate('/auth/login');
    },
  });

  return {
    // State
    user,
    isAuthenticated,

    // Mutations
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,

    // Loading states
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
};
