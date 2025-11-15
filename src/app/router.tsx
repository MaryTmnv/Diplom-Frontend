
import { DashboardPage } from "@/pages/client/DashboardPage";
import { AnalyticsDashboard } from "@/pages/manager";
import { QueuePage } from "@/pages/operator";
import { EmptyState } from "@/shared/components/EmptyState";
import { MainLayout, ClientLayout, OperatorLayout, ManagerLayout } from "@/shared/components/Layout";
import { createBrowserRouter } from "react-router-dom";


// Временная главная страница
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
        element: <DashboardPage />,
      },
      {
        path: 'tickets/create',
        element: (
          <div>
            <h1 className="text-3xl font-bold mb-4">Создать заявку</h1>
            <p className="text-gray-600">Форма создания заявки...</p>
          </div>
        ),
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
        element: <QueuePage />,
      },
      {
        path: 'my-tickets',
        element: (
          <div>
            <h1 className="text-3xl font-bold mb-4">Мои заявки</h1>
            <p className="text-gray-600">Список моих заявок...</p>
          </div>
        ),
      },
      {
        path: 'templates',
        element: (
          <div>
            <h1 className="text-3xl font-bold mb-4">Шаблоны ответов</h1>
            <p className="text-gray-600">Библиотека шаблонов...</p>
          </div>
        ),
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
        element: <AnalyticsDashboard />,
      },
      {
        path: 'team',
        element: (
          <div>
            <h1 className="text-3xl font-bold mb-4">Команда</h1>
            <p className="text-gray-600">Производительность команды...</p>
          </div>
        ),
      },
      {
        path: 'reports',
        element: (
          <div>
            <h1 className="text-3xl font-bold mb-4">Отчёты</h1>
            <p className="text-gray-600">Генерация отчётов...</p>
          </div>
        ),
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
