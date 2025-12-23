import { api } from '@/shared/lib/api/apiClient';
import {
  LoginDto,
  RegisterDto,
  AuthResponse,
} from '../types/auth.types';
import { UserType } from '@/shared/types/user.types';

export const authApi = {
  // Вход
  login: async (credentials: LoginDto): Promise<AuthResponse> => {
    return api.post<AuthResponse>('/auth/login', credentials);
  },

  // Регистрация
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const { confirmPassword, ...registerData } = data as any;
    return api.post<AuthResponse>('/auth/register', registerData);
  },

  // Выход
  logout: async (): Promise<void> => {
    return api.post<void>('/auth/logout');
  },

  // Получение текущего пользователя
  getCurrentUser: async (): Promise<UserType> => {
    return api.get<UserType>('/auth/me');
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
