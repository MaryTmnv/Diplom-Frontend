/* eslint-disable @typescript-eslint/no-explicit-any */
import { env } from "../../config/env";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

// Создаём axios instance
export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - добавляем токен к каждому запросу
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Получаем токен из localStorage (позже заменим на authStore)
    const token = localStorage.getItem('auth_token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - обработка ошибок
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Если 401 и это не повторный запрос
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Попытка обновить токен (реализуем позже в auth модуле)
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (refreshToken) {
          // TODO: Вызов API для обновления токена
          // const { data } = await axios.post(`${env.apiUrl}/auth/refresh`, { refreshToken });
          // localStorage.setItem('auth_token', data.accessToken);
          // originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          // return apiClient(originalRequest);
        }
        
        // Если нет refresh токена - редирект на логин
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/auth/login';
      } catch (refreshError) {
        // Если обновление токена не удалось
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Типизированные методы API
export const api = {
  get: <T = any>(url: string, config?: any) => 
    apiClient.get<T>(url, config).then((res) => res.data),
    
  post: <T = any>(url: string, data?: any, config?: any) => 
    apiClient.post<T>(url, data, config).then((res) => res.data),
    
  put: <T = any>(url: string, data?: any, config?: any) => 
    apiClient.put<T>(url, data, config).then((res) => res.data),
    
  patch: <T = any>(url: string, data?: any, config?: any) => 
    apiClient.patch<T>(url, data, config).then((res) => res.data),
    
  delete: <T = any>(url: string, config?: any) => 
    apiClient.delete<T>(url, config).then((res) => res.data),
};
