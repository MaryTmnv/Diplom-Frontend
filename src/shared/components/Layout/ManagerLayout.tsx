import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { BarChart3, Users, FileBarChart, Shield } from 'lucide-react';
import { Header } from './Header';
import { Sidebar, NavItem } from './Sidebar';
import { useAuthStore } from '@/features/auth/store/authStore';
import { UserRole } from '@/shared/types/user.types';

export const ManagerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();

  if (!user) {
    return null;
  }

  // Базовые пункты меню
  const navItems: NavItem[] = [
    {
      label: 'Аналитика',
      href: '/manager/analytics',
      icon: BarChart3,
    },
    {
      label: 'Команда',
      href: '/manager/team',
      icon: Users,
    },
    {
      label: 'Отчёты',
      href: '/manager/reports',
      icon: FileBarChart,
    },
  ];

  // Если ADMIN - добавляем дополнительный пункт
  if (user.role === UserRole.ADMIN) {
    navItems.push({
      label: 'Администрирование',
      href: '/manager/admin',
      icon: Shield,
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        variant="manager"
        user={user}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onLogout={logout}
      />

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar items={navItems} />
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed left-0 top-16 bottom-0 w-64 bg-white z-50 md:hidden">
              <Sidebar items={navItems} />
            </div>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
