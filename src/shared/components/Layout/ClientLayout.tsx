import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { LayoutDashboard, MessageSquare, FileText } from 'lucide-react';
import { Header } from './Header';
import { Sidebar, NavItem } from './Sidebar';
import { useAuthStore } from '@/features/auth/store/authStore';

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
  const { user, logout } = useAuthStore();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        variant="client"
        user={user}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onLogout={logout}
      />

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar items={clientNavItems} />
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed left-0 top-16 bottom-0 w-64 bg-white z-50 md:hidden">
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
