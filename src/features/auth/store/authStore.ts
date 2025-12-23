import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserType } from '@/shared/types/user.types';

console.log('📦 authStore.ts loading...');

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
    (set, get) => {
      console.log('🏗️ Creating authStore');
      
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        _hasHydrated: false,

        setUser: (user: UserType) => {
          console.log('🔐 setUser called with:', user);
          
          set({ user, isAuthenticated: true });
          
          const newState = get();
          console.log('🔐 State after setUser:', {
            user: newState.user,
            isAuthenticated: newState.isAuthenticated,
          });

          // Проверяем что попало в localStorage
          setTimeout(() => {
            const lsData = localStorage.getItem('helpmate-auth-storage');
            console.log('🔐 localStorage after setUser:', lsData);
          }, 100);
        },

        setToken: (token: string) => {
          console.log('🔑 setToken called with:', '***' + token.slice(-10));
          
          set({ token });
          
          const newState = get();
          console.log('🔑 State after setToken:', {
            token: newState.token ? '***' + newState.token.slice(-10) : null,
          });

          // Проверяем что попало в localStorage
          setTimeout(() => {
            const lsData = localStorage.getItem('helpmate-auth-storage');
            console.log('🔑 localStorage after setToken:', lsData);
          }, 100);
        },

        logout: () => {
          console.log('👋 logout called');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
          console.log('👋 State after logout:', get());
        },

        setHasHydrated: (state: boolean) => {
          console.log('💧 setHasHydrated called:', state);
          set({ _hasHydrated: state });
        },
      };
    },
    {
      name: 'helpmate-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        console.log('💾 Partializing state:', {
          user: state.user,
          token: state.token ? '***' + state.token.slice(-10) : null,
          isAuthenticated: state.isAuthenticated,
        });
        
        const result = {
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        };
        
        console.log('💾 Partialize result:', result);
        return result;
      },
      onRehydrateStorage: () => {
        console.log('💧 onRehydrateStorage: Starting...');
        
        return (state?: AuthStore, error?: unknown) => {
          console.log('💧 Rehydration callback executing');
          
          if (error) {
            console.error('💧 ❌ Hydration ERROR:', error);
            return;
          }
          
          if (!state) {
            console.warn('💧 ⚠️ State is undefined');
            return;
          }
          
          console.log('💧 ✅ Hydration SUCCESS');
          console.log('💧 Hydrated state:', {
            user: state.user ? { email: state.user.email, role: state.user.role } : null,
            token: state.token ? '***' + state.token.slice(-10) : null,
            isAuthenticated: state.isAuthenticated,
          });
          
          state.setHasHydrated(true);
          console.log('💧 _hasHydrated set to TRUE');
        };
      },
    }
  )
);

console.log('📦 ✅ authStore created');

// Хук для проверки гидратации
export const useHasHydrated = () => {
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  return hasHydrated;
};

// Подписка на изменения (только в dev)
if (import.meta.env.DEV) {
  useAuthStore.subscribe((state) => {
    console.log('🔔 Store updated:', {
      user: state.user ? state.user.email : null,
      isAuthenticated: state.isAuthenticated,
      _hasHydrated: state._hasHydrated,
    });
  });
}
