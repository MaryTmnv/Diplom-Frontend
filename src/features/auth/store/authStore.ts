import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/shared/types/user.types';

interface AuthStore {
  // Данные аутентификации
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  
  // Флаг гидратации (для persist middleware)
  _hasHydrated: boolean;
  
  // Действия
  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
  setToken: (token: string) => void; // ← Алиас для setAccessToken
  login: (user: User, accessToken: string) => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Начальное состояние
      user: null,
      accessToken: null,
      isAuthenticated: false,
      _hasHydrated: false,

      // Установить пользователя
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      // Установить токен
      setAccessToken: (accessToken) =>
        set({
          accessToken,
        }),

      // Алиас для setAccessToken (для обратной совместимости)
      setToken: (accessToken) =>
        set({
          accessToken,
        }),

      // Вход (устанавливаем и пользователя, и токен)
      login: (user, accessToken) => {
        console.log('🔐 Login:', user.email);
        set({
          user,
          accessToken,
          isAuthenticated: true,
        });
      },

      // Выход
      logout: () => {
        console.log('👋 Logout');
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },

      // Установить флаг гидратации
      setHasHydrated: (state) => {
        set({
          _hasHydrated: state,
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      
      // Обработчик после гидратации
      onRehydrateStorage: () => (state) => {
        console.log('💧 Hydration finished');
        state?.setHasHydrated(true);
      },

      // Частичная гидратация (не сохраняем _hasHydrated)
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Хук для проверки гидратации
export const useHasHydrated = () => {
  return useAuthStore((state) => state._hasHydrated);
};
