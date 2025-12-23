import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { BarChart3, Users, FileBarChart } from 'lucide-react';
import { Header } from './Header';
import { Sidebar, NavItem } from './Sidebar';
import { useAuthStore } from '@/features/auth/store/authStore';

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
  console.log('🏗️ ManagerLayout rendering');
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();

  if (!user) {
    console.error('❌ ManagerLayout: No user found!');
    return null;
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
        <div className="hidden md:block">
          <Sidebar items={managerNavItems} />
        </div>

        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed left-0 top-16 bottom-0 w-64 bg-white z-50 md:hidden">
              <Sidebar items={managerNavItems} />
            </div>
          </>
        )}

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
