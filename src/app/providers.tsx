import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { queryClient } from '@/shared/lib/api/queryClient';
import { useAuthStore } from '@/features/auth/store/authStore';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  const [isReady, setIsReady] = useState(false);

  // Ожидание гидратации
  useEffect(() => {
    console.log('🚀 Providers mounted');
    
    const checkHydration = () => {
      const state = useAuthStore.getState();
      console.log('🔍 Hydration check:', {
        _hasHydrated: state._hasHydrated,
        isAuthenticated: state.isAuthenticated,
        user: state.user?.email,
      });
      
      if (state._hasHydrated) {
        console.log('✅ Already hydrated');
        setIsReady(true);
        return true;
      }
      return false;
    };

    if (checkHydration()) return;

    console.log('⏳ Waiting for hydration...');
    const unsubscribe = useAuthStore.subscribe((state) => {
      if (state._hasHydrated && !isReady) {
        console.log('✅ Hydration complete!');
        setIsReady(true);
      }
    });

    const timeout = setTimeout(() => {
      console.warn('⚠️ Hydration timeout');
      setIsReady(true);
    }, 2000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [isReady]);

  // Мониторинг store
  useEffect(() => {
    console.log('👀 Store monitor started');
    
    let prevState = useAuthStore.getState();
    
    const unsubscribe = useAuthStore.subscribe((state) => {
      if (prevState.isAuthenticated !== state.isAuthenticated) {
        console.log('🔔 isAuthenticated changed:', 
          `${prevState.isAuthenticated} → ${state.isAuthenticated}`
        );
      }

      if (prevState.isAuthenticated && !state.isAuthenticated) {
        console.error('🚨 AUTH LOST!');
        console.trace();
      }

      prevState = state;
    });

    return unsubscribe;
  }, []);

  if (!isReady) {
    return <LoadingSpinner fullScreen text="Инициализация..." />;
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
