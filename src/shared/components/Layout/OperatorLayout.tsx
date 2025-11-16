import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Inbox, ListChecks, FileText } from 'lucide-react';
import { Header } from './Header';
import { Sidebar, NavItem } from './Sidebar';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useQueue } from '@/features/tickets/hooks/useQueue';  
import { useMyActiveTickets } from '@/features/tickets/hooks/useMyActiveTickets';  

export const OperatorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuthStore();
  const { logout } = useAuth();

  // Загружаем данные для бейджей
  const { data: queueTickets = [] } = useQueue();
  const { data: myTickets = [] } = useMyActiveTickets();

  const operatorNavItems: NavItem[] = [
    {
      label: 'Очередь заявок',
      href: '/operator/queue',
      icon: Inbox,
      badge: queueTickets.length,  // ← динамический бейдж
    },
    {
      label: 'Мои заявки',
      href: '/operator/my-tickets',
      icon: ListChecks,
      badge: myTickets.length,  // ← динамический бейдж
    },
    {
      label: 'Шаблоны ответов',
      href: '/operator/templates',
      icon: FileText,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        variant="operator"
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
          <Sidebar items={operatorNavItems} />
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed left-0 top-16 bottom-0 w-64 bg-white z-50 md:hidden animate-slide-in-left">
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
