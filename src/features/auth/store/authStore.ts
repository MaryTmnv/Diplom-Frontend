import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserType } from '@/shared/types/user.types';

interface AuthStore {
  user: UserType | null;
  token: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setUser: (user: UserType) => void;
  setToken: (token: string) => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setUser: (user: UserType) => {
        set({ user, isAuthenticated: true });
      },

      setToken: (token: string) => {
        set({ token });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },
    }),
    {
      name: 'helpmate-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => {
        return (state?: AuthStore, error?: unknown) => {
          if (error || !state) {
            return;
          }
          
          state.setHasHydrated(true);
        };
      },
    }
  )
);

// Хук для проверки гидратации
export const useHasHydrated = () => {
  return useAuthStore((state) => state._hasHydrated);
};
