import { api } from '@/shared/lib/api/apiClient';
import type { User } from '@/shared/types/user.types';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface TokenResponse {
  accessToken: string;
}

export const authApi = {
  /**
   * Вход в систему
   */
  login: async (credentials: LoginDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  /**
   * Регистрация
   */
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  /**
   * Выход
   */
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  /**
   * Обновление токена
   */
  refreshToken: async (): Promise<TokenResponse> => {
    const response = await api.post<TokenResponse>('/auth/refresh', {}, {
      withCredentials: true,
    });
    return response.data;
  },

  /**
   * Получить текущего пользователя
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  /**
   * Восстановление пароля
   */
  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/auth/forgot-password', { email });
  },

  /**
   * Сброс пароля
   */
  resetPassword: async (token: string, password: string): Promise<void> => {
    await api.post('/auth/reset-password', { token, password });
  },
};
