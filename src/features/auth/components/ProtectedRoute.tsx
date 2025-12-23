import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore, useHasHydrated } from '../store/authStore';
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
  const hasHydrated = useHasHydrated();
  const { isAuthenticated, user } = useAuthStore();

  console.log('🔒 ProtectedRoute:', {
    url: window.location.pathname,
    hasHydrated,
    isAuthenticated,
    user: user ? { email: user.email, role: user.role } : null,
    requiredRoles: roles,
  });

  // Ждём гидратации
  if (!hasHydrated) {
    console.log('⏳ ProtectedRoute: Waiting for hydration');
    return <LoadingSpinner fullScreen text="Проверка авторизации..." />;
  }

  // Проверяем авторизацию
  if (!isAuthenticated || !user) {
    console.log('❌ ProtectedRoute: Not authenticated, redirecting');
    return <Navigate to={redirectTo} replace />;
  }

  // Проверяем роль
  if (roles && !roles.includes(user.role)) {
    console.log('❌ ProtectedRoute: Role mismatch');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8">
          <h1 className="text-6xl mb-4">🚫</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Доступ запрещён
          </h2>
          <p className="text-gray-600 mb-4">
            У вас нет прав для просмотра этой страницы
          </p>
          <div className="text-sm text-gray-500 mb-6 p-3 bg-gray-100 rounded-lg">
            <p>Ваша роль: <strong>{user.role}</strong></p>
            <p>Требуется: <strong>{roles.join(' или ')}</strong></p>
          </div>
          <a 
            href="/" 
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            На главную
          </a>
        </div>
      </div>
    );
  }

  console.log('✅ ProtectedRoute: Access granted');
  return <Outlet />;
};
