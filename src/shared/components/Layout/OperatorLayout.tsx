import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Inbox, ListChecks, FileText } from 'lucide-react';
import { Header } from './Header';
import { Sidebar, NavItem } from './Sidebar';

const mockUser = {
  firstName: 'Анна',
  lastName: 'Смирнова',
  email: 'anna@helpmate.ru',
  avatar: undefined,
};

const operatorNavItems: NavItem[] = [
  {
    label: 'Очередь заявок',
    href: '/operator/queue',
    icon: Inbox,
    badge: 12, // Количество заявок в очереди
  },
  {
    label: 'Мои заявки',
    href: '/operator/my-tickets',
    icon: ListChecks,
    badge: 5,
  },
  {
    label: 'Шаблоны ответов',
    href: '/operator/templates',
    icon: FileText,
  },
];

export const OperatorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        variant="operator"
        user={mockUser}
        unreadNotifications={2}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onLogout={() => console.log('Logout')}
      />

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:block">
          <Sidebar items={operatorNavItems} />
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed left-0 top-16 bottom-0 w-64 bg-white z-50 md:hidden">
              <Sidebar items={operatorNavItems} />
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
