import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { LayoutDashboard, MessageSquare, FileText } from 'lucide-react';
import { Header } from './Header';
import { Sidebar, NavItem } from './Sidebar';

// Моковый пользователь (потом заменим на реальные данные из auth store)
const mockUser = {
  firstName: 'Иван',
  lastName: 'Петров',
  email: 'ivan@example.com',
  avatar: undefined,
};

const clientNavItems: NavItem[] = [
  {
    label: 'Мои заявки',
    href: '/client/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Создать заявку',
    href: '/client/tickets/create',
    icon: MessageSquare,
  },
  {
    label: 'База знаний',
    href: '/knowledge-base',
    icon: FileText,
  },
];

export const ClientLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        variant="client"
        user={mockUser}
        unreadNotifications={3}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onLogout={() => console.log('Logout')}
      />

      <div className="flex">
        {/* Sidebar - скрыт на мобильных */}
        <div className="hidden md:block">
          <Sidebar items={clientNavItems} />
        </div>

        {/* Mobile Sidebar (overlay) */}
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            
            {/* Sidebar */}
            <div className="fixed left-0 top-16 bottom-0 w-64 bg-white z-50 md:hidden animate-slide-in-left">
              <Sidebar items={clientNavItems} />
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
