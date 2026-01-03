import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthStore } from '../types/auth.types';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // State
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setAuth: (data) => {
        console.log('🔐 setAuth called:', { 
          userId: data.user.id, 
          role: data.user.role,
          hasToken: !!data.accessToken 
        });
        
        set({
          user: data.user,
          accessToken: data.accessToken,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      setUser: (user) => {
        console.log('👤 setUser called:', { userId: user.id, role: user.role });
        set({ user, isAuthenticated: true });
      },

      setAccessToken: (token) => {
        console.log('🔑 setAccessToken called');
        set({ accessToken: token });
      },

      logout: () => {
        console.log('🚪 logout called');
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
        
        // Очищаем localStorage
        localStorage.clear();
        
        // Очищаем cookies (если нужно)
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
      },

      clearAuth: () => {
        console.log('🧹 clearAuth called');
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
