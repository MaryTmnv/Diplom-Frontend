import axios from 'axios';
import toast from 'react-hot-toast';
import { env } from '@/shared/config/env';
import { useAuthStore } from '@/features/auth/store/authStore';

console.log('📡 apiClient.ts loading...');

// Создаём базовый axios instance
export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - добавляем токен из Zustand store
apiClient.interceptors.request.use(
  (config) => {
    console.log('📤 API Request:', config.method?.toUpperCase(), config.url);
    
    // Получаем токен из Zustand store (НЕ из localStorage!)
    const token = useAuthStore.getState().token;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token added to request');
    } else {
      console.warn('⚠️ No token available for request');
    }

    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - обработка ошибок
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.method?.toUpperCase(), response.config.url, response.status);
    return response;
  },
  async (error: any) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message,
    });

    const originalRequest = error.config;

    // Обработка 401 - неавторизован
    if (error.response?.status === 401) {
      console.warn('🚨 401 Unauthorized');

      // ⚠️ НЕ ДЕЛАЕМ АВТОМАТИЧЕСКИЙ LOGOUT!
      // Просто логируем и возвращаем ошибку
      // Пусть компоненты сами решают что делать

      // Можно показать toast
      toast.error('Сессия истекла. Пожалуйста, войдите снова.');

      // Возвращаем ошибку без редиректа
      return Promise.reject(error);
    }

    // Обработка других ошибок
    const errorMessage = error.response?.data?.message || 'Произошла ошибка';

    // Показываем toast для других ошибок
    if (error.response?.status !== 401) {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

// Типизированные методы API
export const api = {
  get: <T = any>(url: string, config?: any) => {
    console.log('🔵 api.get:', url);
    return apiClient.get<T>(url, config).then((res) => res.data);
  },

  post: <T = any>(url: string, data?: unknown, config?: any) => {
    console.log('🟢 api.post:', url);
    return apiClient.post<T>(url, data, config).then((res) => res.data);
  },

  put: <T = any>(url: string, data?: unknown, config?: any) => {
    console.log('🟡 api.put:', url);
    return apiClient.put<T>(url, data, config).then((res) => res.data);
  },

  patch: <T = any>(url: string, data?: unknown, config?: any) => {
    console.log('🟠 api.patch:', url);
    return apiClient.patch<T>(url, data, config).then((res) => res.data);
  },

  delete: <T = any>(url: string, config?: any) => {
    console.log('🔴 api.delete:', url);
    return apiClient.delete<T>(url, config).then((res) => res.data);
  },
};

console.log('📡 ✅ apiClient configured');
