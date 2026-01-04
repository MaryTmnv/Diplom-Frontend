import axios from 'axios';
import { useAuthStore } from '@/features/auth/store/authStore';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor (добавление токена)
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor (обработка ошибок и обновление токена)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Если 401 и не повторный запрос - пробуем обновить токен
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('🔄 Attempting to refresh token...');
        
        // Типизируем ответ refresh endpoint
        const response = await axios.post<{ accessToken: string }>( // ← Типизация!
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data; // ← Теперь TypeScript знает про accessToken

        // Сохраняем новый токен
        useAuthStore.getState().setAccessToken(accessToken);

        // Повторяем оригинальный запрос с новым токеном
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        
        // Если обновление токена не удалось - разлогиниваем
        useAuthStore.getState().logout();
        
        // Редирект на логин
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }

        return Promise.reject(refreshError);
      }
    }

    // Обработка других ошибок
    handleApiError(error);
    
    return Promise.reject(error);
  }
);

// Обработчик ошибок API
function handleApiError(error: any) {
  if (!error.response) {
    toast.error('Ошибка сети. Проверьте подключение к интернету.');
    return;
  }

  const status = error.response.status;
  const message = error.response.data?.message || 'Произошла ошибка';

  switch (status) {
    case 400:
      toast.error(message || 'Неверные данные запроса');
      break;
    case 401:
      // Уже обработано в interceptor
      break;
    case 403:
      toast.error('Доступ запрещён');
      break;
    case 404:
      toast.error('Ресурс не найден');
      break;
    case 409:
      toast.error(message || 'Конфликт данных');
      break;
    case 422:
      toast.error(message || 'Ошибка валидации');
      break;
    case 500:
      toast.error('Ошибка сервера. Попробуйте позже.');
      break;
    default:
      toast.error(message);
  }
}
