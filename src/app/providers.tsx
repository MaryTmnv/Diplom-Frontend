import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { validateEnv, env } from '../shared/config/env';
import { queryClient } from '../shared/lib/api/queryClient';


interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  // Валидация переменных окружения при монтировании
  useEffect(() => {
    try {
      validateEnv();
    } catch (error) {
      console.error('❌ Environment validation failed:', error);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Основной контент приложения */}
      {children}
      
      {/* Toast уведомления */}
      <Toaster
        position="top-right"
        gutter={8}
        containerStyle={{
          top: 80, // Отступ от header
        }}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#1f2937',
            border: '1px solid #e5e7eb',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
          loading: {
            iconTheme: {
              primary: '#6366f1',
              secondary: '#fff',
            },
          },
        }}
      />
      
      {/* React Query DevTools - только в development */}
      {env.isDev && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
};
