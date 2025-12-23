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
  withCredentials: true, // ← Важно! Для отправки cookies с refresh token
});

// ========== ФЛАГИ ДЛЯ REFRESH TOKEN ==========
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// ========== REQUEST INTERCEPTOR ==========
apiClient.interceptors.request.use(
  (config) => {
    console.log('📤 API Request:', config.method?.toUpperCase(), config.url);
    
    // Получаем токен из Zustand store
    const token = useAuthStore.getState().token;
    
    // Добавляем токен ко всем запросам (кроме refresh)
    if (token && config.headers && !config.url?.includes('/auth/refresh')) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token added to request');
    } else if (!token) {
      console.warn('⚠️ No token available for request');
    }

    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ========== RESPONSE INTERCEPTOR ==========
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

  const originalRequest = error.config as any & { _retry?: boolean };

    // ========== ОБРАБОТКА 401 С REFRESH TOKEN ==========
    if (error.response?.status === 401) {
      console.warn('🚨 401 Unauthorized');

      // Если это запрос на refresh или login - не пытаемся обновить токен
      if (
        originalRequest.url?.includes('/auth/refresh') ||
        originalRequest.url?.includes('/auth/login')
      ) {
        console.error('❌ Refresh/Login failed - logging out');
        handleLogout('Сессия истекла. Пожалуйста, войдите снова.');
        return Promise.reject(error);
      }

      // Если это повторный запрос после refresh - разлогиниваем
      if (originalRequest._retry) {
        console.error('❌ Retry after refresh failed - logging out');
        handleLogout('Не удалось восстановить сессию. Войдите снова.');
        return Promise.reject(error);
      }

      // Помечаем запрос как повторный
      originalRequest._retry = true;

      // Если уже идёт процесс обновления токена - добавляем в очередь
      if (isRefreshing) {
        console.log('⏳ Refresh already in progress, adding to queue...');
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            console.log('✅ Token refreshed from queue, retrying request');
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            console.error('❌ Queue request failed:', err);
            return Promise.reject(err);
          });
      }

      // Начинаем процесс обновления токена
      console.log('🔄 Starting token refresh...');
      isRefreshing = true;

      try {
        // Запрашиваем новый access token
        const response = await apiClient.post<{ accessToken: string }>('/auth/refresh');
        const newToken = response.data.accessToken;

        console.log('✅ Token refreshed successfully');

        // Сохраняем новый токен
        useAuthStore.getState().setToken(newToken);

        // Обновляем токен в оригинальном запросе
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        // Обрабатываем очередь запросов
        processQueue(null, newToken);

        // Повторяем оригинальный запрос
        console.log('🔁 Retrying original request with new token');
        return apiClient(originalRequest);
      } catch (refreshError: any) {
        console.error('❌ Token refresh failed:', refreshError);
        
        // Обрабатываем очередь с ошибкой
        processQueue(refreshError, null);
        
        // Разлогиниваем
        handleLogout('Сессия истекла. Пожалуйста, войдите снова.');
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ========== ОБРАБОТКА ДРУГИХ ОШИБОК ==========
    const errorMessage = error.response?.data?.message || 'Произошла ошибка';

    // Показываем toast для других ошибок
    switch (error.response?.status) {
      case 403:
        toast.error('Доступ запрещён');
        break;
      case 404:
        // Не показываем toast для 404, обрабатываем на уровне компонентов
        console.warn('⚠️ 404 Not Found:', error.config?.url);
        break;
      case 422:
        toast.error(errorMessage || 'Ошибка валидации данных');
        break;
      case 429:
        toast.error('Слишком много запросов. Попробуйте позже.');
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        toast.error('Ошибка сервера. Попробуйте позже.');
        break;
      default:
        if (error.response?.status && error.response.status >= 400) {
          toast.error(errorMessage);
        }
        break;
    }

    return Promise.reject(error);
  }
);

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========

const handleLogout = (message: string) => {
  console.log('🚪 Logging out:', message);
  
  useAuthStore.getState().logout();
  toast.error(message);

  // Редирект на логин (если не на публичной странице)
  const publicPaths = ['/auth', '/knowledge-base', '/'];
  const isPublicPath = publicPaths.some(path => window.location.pathname.startsWith(path));
  
  if (!isPublicPath) {
    // Сохраняем текущий URL для редиректа после логина
    const returnUrl = window.location.pathname + window.location.search;
    console.log('🔀 Redirecting to login with returnUrl:', returnUrl);
    window.location.href = `/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`;
  }
};

// ========== ТИПИЗИРОВАННЫЕ МЕТОДЫ API ==========

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

console.log('📡 ✅ apiClient configured with refresh token support');
