import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { EmptyState } from '@/shared/components/EmptyState';
import { 
  MainLayout, 
  ClientLayout, 
  OperatorLayout, 
  ManagerLayout 
} from '@/shared/components/Layout';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { UserRole } from '@/shared/types/user.types';



// ========== LAZY LOADING СТРАНИЦ ========== 
// Client pages
const DashboardPage = lazy(() => import('@/pages/client/DashboardPage'));
const CreateTicketPage = lazy(() => import('@/pages/client/CreateTicketPage'));  // ← lazy
const TicketDetailPage = lazy(() => import('@/pages/client/TicketDetailPage'));  // ← lazy

// Operator pages
const QueuePage = lazy(() => import('@/pages/operator/QueuePage'));
const MyTicketsPage = lazy(() => import('@/pages/operator/MyTicketsPage'));  // ← добавили
const TicketWorkspacePage = lazy(() => import('@/pages/operator/TicketWorkspacePage'));  // ← добавили
const TemplatesPage = lazy(()=> import('@/pages/operator/TemplatesPage'))
// Manager pages
const AnalyticsDashboard = lazy(() => import('@/pages/manager/AnalyticsDashboard'));

// Auth pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));

// ========== FALLBACK КОМПОНЕНТ ==========
const PageLoader = () => (
  <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      <p className="text-sm text-gray-600 font-medium">Загрузка...</p>
    </div>
  </div>
);

// ========== ОБЁРТКА ДЛЯ SUSPENSE ==========
const withSuspense = (Component: React.LazyExoticComponent<any>) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

// ========== ВРЕМЕННАЯ ГЛАВНАЯ СТРАНИЦА ==========
const HomePage = () => {
  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center">
      <div className="text-center max-w-2xl px-4">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl mb-4">
            <span className="text-white font-bold text-4xl">H</span>
          </div>
        </div>
        
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Добро пожаловать в HelpMate
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Современная система поддержки клиентов банка
        </p>
        
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="/auth/login" className="btn-primary">
            Войти в систему
          </a>
          <a href="/knowledge-base" className="btn-secondary">
            База знаний
          </a>
        </div>

        {/* Быстрые ссылки для разработки */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">Быстрый доступ (dev):</p>
          <div className="flex gap-2 justify-center flex-wrap text-xs">
            <a href="/client/dashboard" className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">
              👤 Клиент
            </a>
            <a href="/operator/queue" className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
              🎧 Оператор
            </a>
            <a href="/manager/analytics" className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200">
              📊 Руководитель
            </a>
          </div>
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

  // ========== АУТЕНТИФИКАЦИЯ ==========
  {
    path: '/auth',
    children: [
      {
        path: 'login',
        element: withSuspense(LoginPage),
      },
      {
        path: 'register',
        element: withSuspense(RegisterPage),
      },
      {
        path: 'forgot-password',
        element: withSuspense(ForgotPasswordPage),
      },
    ],
  },

  // ========== КЛИЕНТСКАЯ ЧАСТЬ (ЗАЩИЩЕНО) ==========
  {
    path: '/client',
    element: <ProtectedRoute roles={[UserRole.CLIENT]} />,
    children: [
      {
        element: <ClientLayout />,
      children: [
        {
          path: 'dashboard',
          element: withSuspense(DashboardPage),
        },
        {
          path: 'tickets/create',
          element: withSuspense(CreateTicketPage),  // ← реальная страница
        },
        {
          path: 'tickets/:id',
          element: withSuspense(TicketDetailPage),  // ← реальная страница
        },
      ],

      },
    ],
  },

  // ========== ИНТЕРФЕЙС ОПЕРАТОРА (ЗАЩИЩЕНО) ==========
  {
  path: '/operator',
  element: <ProtectedRoute roles={[UserRole.OPERATOR, UserRole.SPECIALIST]} />,
  children: [
    {
      element: <OperatorLayout />,
      children: [
        {
          path: 'queue',
          element: withSuspense(QueuePage),
        },
        {
          path: 'my-tickets',
          element: withSuspense(MyTicketsPage),  // ← реальная страница
        },
        {
          path: 'tickets/:id',
          element: withSuspense(TicketWorkspacePage),  // ← реальная страница
        },
        {
          path: 'templates',
          element: (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">Шаблоны ответов</h1>
              <p className="text-gray-600">Библиотека шаблонов (скоро)...</p>
            </div>
          ),
        },
      ],
    },
  ],
},


  // ========== ИНТЕРФЕЙС РУКОВОДИТЕЛЯ (ЗАЩИЩЕНО) ==========
  {
    path: '/manager',
    element: <ProtectedRoute roles={[UserRole.MANAGER]} />,
    children: [
      {
        element: <ManagerLayout />,
        children: [
          {
            path: 'analytics',
            element: withSuspense(AnalyticsDashboard),
          },
          {
            path: 'team',
            element: (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Команда</h1>
                <p className="text-gray-600">Производительность команды (скоро)...</p>
              </div>
            ),
          },
          {
            path: 'reports',
            element: (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Отчёты</h1>
                <p className="text-gray-600">Генерация отчётов (скоро)...</p>
              </div>
            ),
          },
        ],
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
