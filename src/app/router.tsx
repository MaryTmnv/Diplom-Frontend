import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { EmptyState } from '@/shared/components/EmptyState';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { 
  MainLayout, 
  ClientLayout, 
  OperatorLayout, 
  ManagerLayout 
} from '@/shared/components/Layout';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { UserRole } from '@/shared/types/user.types';

// ========== LAZY LOADING СТРАНИЦ ========== 

// Public pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const KnowledgeBasePage = lazy(() => import('@/pages/KnowledgeBasePage'));
const ArticlePage = lazy(() => import('@/pages/ArticlePage'));

// Auth pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));

// Client pages
const DashboardPage = lazy(() => import('@/pages/client/DashboardPage'));
const CreateTicketPage = lazy(() => import('@/pages/client/CreateTicketPage'));
const TicketDetailPage = lazy(() => import('@/pages/client/TicketDetailPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));

// Operator pages
const QueuePage = lazy(() => import('@/pages/operator/QueuePage'));
const MyTicketsPage = lazy(() => import('@/pages/operator/MyTicketsPage'));
const TicketWorkspacePage = lazy(() => import('@/pages/operator/TicketWorkspacePage'));
const TemplatesPage = lazy(() => import('@/pages/operator/TemplatesPage'));

// Manager pages
const AnalyticsDashboard = lazy(() => import('@/pages/manager/AnalyticsDashboard'));
const TeamPerformancePage = lazy(() => import('@/pages/manager/TeamPerformancePage'));
const ReportsPage = lazy(() => import('@/pages/manager/ReportsPage'));
const AdminPage = lazy(() => import('@/pages/manager/AdminPage'));
// ========== FALLBACK КОМПОНЕНТ ==========
const PageLoader = () => (
  <LoadingSpinner fullScreen text="Загрузка страницы..." />
);

// ========== ОБЁРТКА ДЛЯ SUSPENSE ==========
const withSuspense = (Component: React.LazyExoticComponent<any>) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  // ========== ПУБЛИЧНЫЕ СТРАНИЦЫ ==========
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: withSuspense(HomePage),
      },
      {
        path: 'knowledge-base',
        element: withSuspense(KnowledgeBasePage),
      },
      {
        path: 'knowledge-base/:slug',
        element: withSuspense(ArticlePage),
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
            element: withSuspense(CreateTicketPage),
          },
          {
            path: 'tickets/:id',
            element: withSuspense(TicketDetailPage),
          },
           // Общие страницы
        {
          path: 'profile',
          element: withSuspense(ProfilePage),
        },
        {
          path: 'settings',
          element: withSuspense(SettingsPage),
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
            element: withSuspense(MyTicketsPage),
          },
          {
            path: 'tickets/:id',
            element: withSuspense(TicketWorkspacePage),
          },
          {
            path: 'templates',
            element: withSuspense(TemplatesPage),
          },
           // Общие страницы
        {
          path: 'profile',
          element: withSuspense(ProfilePage),
        },
        {
          path: 'settings',
          element: withSuspense(SettingsPage),
        },

        ],
      },
    ],
  },

  // ========== ИНТЕРФЕЙС РУКОВОДИТЕЛЯ (ЗАЩИЩЕНО) ==========
  {
    path: '/manager',
    element: <ProtectedRoute roles={[UserRole.MANAGER, UserRole.ADMIN]} />,
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
              element: withSuspense(TeamPerformancePage),  // ← обновили
            },
            {
              path: 'reports',
              element: withSuspense(ReportsPage),  // ← обновили
            },
            {
              path: 'admin',
              element: withSuspense(AdminPage),  // ← добавили
            },

           // Общие страницы
        {
          path: 'profile',
          element: withSuspense(ProfilePage),
        },
        {
          path: 'settings',
          element: withSuspense(SettingsPage),
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
