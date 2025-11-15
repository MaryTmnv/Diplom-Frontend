import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthStore } from '../types/auth.types';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // State
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setAuth: ({ user, token, refreshToken }) => {
        // Сохраняем токены в localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('refresh_token', refreshToken);

        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      setUser: (user) => {
        set({ user });
      },

      setToken: (token) => {
        localStorage.setItem('auth_token', token);
        set({ token });
      },

      logout: () => {
        // Очищаем localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');

        set({
          user: null,
          token: null,
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
          token: null,
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
