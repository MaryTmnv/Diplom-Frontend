import { api } from '@/shared/lib/api/apiClient';
import {
  LoginDto,
  RegisterDto,
  AuthResponse,
  TokenResponse,
} from '../types/auth.types';
import { User } from '@/shared/types/user.types';

export const authApi = {
  // Вход
  login: async (credentials: LoginDto): Promise<AuthResponse> => {
    return api.post<AuthResponse>('/auth/login', credentials);
  },

  // Регистрация
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    // Убираем confirmPassword перед отправкой
    const { confirmPassword, ...registerData } = data as any;
    return api.post<AuthResponse>('/auth/register', registerData);
  },

  // Выход
  logout: async (refreshToken: string): Promise<void> => {
    return api.post<void>('/auth/logout', { refreshToken });
  },

  // Обновление токена
  refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
    return api.post<TokenResponse>('/auth/refresh', { refreshToken });
  },

  // Получение текущего пользователя
  getCurrentUser: async (): Promise<User> => {
    return api.get<User>('/auth/me');
  },

  // Забыли пароль
  forgotPassword: async (email: string): Promise<void> => {
    return api.post<void>('/auth/forgot-password', { email });
  },

  // Сброс пароля
  resetPassword: async (token: string, password: string): Promise<void> => {
    return api.post<void>('/auth/reset-password', { token, password });
  },
};
