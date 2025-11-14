// src/app/router.tsx
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { EmptyState } from '@/shared/components/EmptyState';
import { 
  MainLayout, 
  ClientLayout, 
  OperatorLayout, 
  ManagerLayout 
} from '@/shared/components/Layout';

// Lazy loading страниц
const DashboardPage = lazy(() => import('@/pages/client/DashboardPage'));

const QueuePage = lazy(() => import('@/pages/operator/QueuePage'));


const AnalyticsDashboard = lazy(() => import('@/pages/manager/AnalyticsDashboard'));


// Fallback компонент
const PageLoader = () => (
  <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
  </div>
);

// Обёртка для Suspense
const withSuspense = (Component: React.LazyExoticComponent<any>) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

// Временная главная страница (не lazy, т.к. маленькая)
const HomePage = () => {
  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center">
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Добро пожаловать в HelpMate
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Современная система поддержки клиентов банка
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/auth/login" className="btn-primary">
            Войти в систему
          </a>
          <a href="/knowledge-base" className="btn-secondary">
            База знаний
          </a>
        </div>
      </div>
    </div>
  );
};

export const router = createBrowserRouter([
  // ========== ПУБЛИЧНЫЕ СТРАНИЦЫ ==========
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'knowledge-base',
        element: (
          <div className="container py-8">
            <h1 className="text-3xl font-bold mb-4">База знаний</h1>
            <p className="text-gray-600">Скоро здесь будут статьи...</p>
          </div>
        ),
      },
    ],
  },

  // ========== КЛИЕНТСКАЯ ЧАСТЬ ==========
  {
    path: '/client',
    element: <ClientLayout />,
    children: [
      {
        path: 'dashboard',
        element: withSuspense(DashboardPage),
      },
    
    ],
  },

  // ========== ИНТЕРФЕЙС ОПЕРАТОРА ==========
  {
    path: '/operator',
    element: <OperatorLayout />,
    children: [
      {
        path: 'queue',
        element: withSuspense(QueuePage),
      },
      
    ],
  },

  // ========== ИНТЕРФЕЙС РУКОВОДИТЕЛЯ ==========
  {
    path: '/manager',
    element: <ManagerLayout />,
    children: [
      {
        path: 'analytics',
        element: withSuspense(AnalyticsDashboard),
      },
      
    ],
  },

  // ========== 404 ==========
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <EmptyState
          icon="🔍"
          title="404 - Страница не найдена"
          description="Запрашиваемая страница не существует или была перемещена."
          action={{
            label: 'На главную',
            onClick: () => (window.location.href = '/'),
          }}
        />
      </div>
    ),
  },
]);
