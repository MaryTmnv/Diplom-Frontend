import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { BarChart3, Users, FileBarChart } from 'lucide-react';
import { Header } from './Header';
import { Sidebar, NavItem } from './Sidebar';

const mockUser = {
  firstName: 'Михаил',
  lastName: 'Кузнецов',
  email: 'mikhail@helpmate.ru',
  avatar: undefined,
};

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        variant="manager"
        user={mockUser}
        unreadNotifications={0}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onLogout={() => console.log('Logout')}
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
            <div className="fixed left-0 top-16 bottom-0 w-64 bg-white z-50 md:hidden">
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
