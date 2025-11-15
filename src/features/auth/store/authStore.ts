import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthStore } from '../types/auth.types';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // State
      user: null,
      accessToken: null,        // ← изменено
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setAuth: ({ user, accessToken, refreshToken }) => {  // ← изменено
        // Сохраняем токены в localStorage
        localStorage.setItem('auth_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);

        set({
          user,
          accessToken,           // ← изменено
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      setUser: (user) => {
        set({ user });
      },

      setAccessToken: (accessToken) => {  // ← изменено
        localStorage.setItem('auth_token', accessToken);
        set({ accessToken });
      },

      logout: () => {
        // Очищаем localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');

        set({
          user: null,
          accessToken: null,     // ← изменено
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      clearAuth: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        
        set({
          user: null,
          accessToken: null,     // ← изменено
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      // Сохраняем только user и isAuthenticated
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
