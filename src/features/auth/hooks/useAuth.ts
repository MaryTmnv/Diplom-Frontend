import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/authApi';
import { LoginDto } from '../types/auth.types';
import { UserRole } from '@/shared/types/user.types';

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, setUser, setToken, logout: storeLogout } = useAuthStore();

  console.log('🔐 useAuth current state:', {
    user: user ? { email: user.email, role: user.role } : null,
    hasToken: !!token,
    isAuthenticated,
  });

  // Мутация для логина
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginDto) => {
      console.log('📤 Login request for:', credentials.email);
      const response = await authApi.login(credentials);
      console.log('📥 Login response:', response);
      return response;
    },
    onSuccess: async (data) => {
      console.log('✅ Login SUCCESS');
      console.log('👤 User:', data.user);
      console.log('🔑 Token:', data.accessToken);
      
      // Сохраняем в store
      console.log('💾 Saving to store...');
      setUser(data.user);
      setToken(data.accessToken);

      // Проверяем что сохранилось
      const storeState = useAuthStore.getState();
      console.log('🔍 Store after save:', {
        user: storeState.user,
        token: storeState.token ? '***' + storeState.token.slice(-10) : null,
        isAuthenticated: storeState.isAuthenticated,
      });

      // Проверяем localStorage
      const lsData = localStorage.getItem('helpmate-auth-storage');
      console.log('💿 localStorage:', lsData ? 'exists' : 'empty');

      toast.success('Вход выполнен успешно!');

      // Редирект в зависимости от роли
      const redirectPaths: Partial<Record<UserRole, string>> = {
        [UserRole.CLIENT]: '/client/dashboard',
        [UserRole.OPERATOR]: '/operator/queue',
        [UserRole.SPECIALIST]: '/operator/queue',
        [UserRole.MANAGER]: '/manager/analytics',
      };

      const redirectPath = redirectPaths[data.user.role] || '/';
      console.log('🚀 Will redirect to:', redirectPath);
      
      // ⏰ ЗАДЕРЖКА 3 секунды для отладки
      console.log('⏳ Waiting 3 seconds...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      console.log('🏃 Redirecting NOW!');
      navigate(redirectPath, { replace: true });
    },
    onError: (error: any) => {
      console.error('❌ Login ERROR:', error);
      const message = error?.response?.data?.message || 'Неверный email или пароль';
      toast.error(message);
    },
  });

  // Функция логаута
  const logout = () => {
    console.log('👋 Logout called');
    storeLogout();
    toast.success('Вы вышли из системы');
    navigate('/auth/login', { replace: true });
  };

  return {
    user,
    token,
    isAuthenticated,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    logout,
  };
};
