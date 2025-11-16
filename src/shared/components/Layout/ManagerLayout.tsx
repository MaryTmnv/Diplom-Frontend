import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { BarChart3, Users, FileBarChart } from 'lucide-react';
import { Header } from './Header';
import { Sidebar, NavItem } from './Sidebar';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useAuth } from '@/features/auth/hooks/useAuth';

const managerNavItems: NavItem[] = [
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

export const ManagerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuthStore();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        variant="manager"
        user={user ? {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          avatar: user.avatar || undefined,
        } : undefined}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onLogout={logout}
      />

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:block">
          <Sidebar items={managerNavItems} />
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed left-0 top-16 bottom-0 w-64 bg-white z-50 md:hidden animate-slide-in-left">
              <Sidebar items={managerNavItems} />
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
