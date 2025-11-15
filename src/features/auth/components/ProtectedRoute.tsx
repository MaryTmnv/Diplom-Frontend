import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '@/shared/types/user.types';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';

interface ProtectedRouteProps {
  roles?: UserRole[];
  redirectTo?: string;
}

export const ProtectedRoute = ({ 
  roles, 
  redirectTo = '/auth/login' 
}: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  // Показываем загрузку пока проверяем auth
  if (isLoading) {
    return <LoadingSpinner fullScreen text="Проверка доступа..." />;
  }

  // Если не авторизован - редирект на login
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Если указаны роли - проверяем доступ
  if (roles && !roles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl mb-4">🚫</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Доступ запрещён
          </h2>
          <p className="text-gray-600 mb-6">
            У вас нет прав для просмотра этой страницы
          </p>
          <a href="/" className="btn-primary">
            На главную
          </a>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
