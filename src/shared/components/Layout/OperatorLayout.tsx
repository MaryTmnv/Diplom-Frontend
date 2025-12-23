import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Inbox, ListChecks, FileText } from 'lucide-react';
import { Header } from './Header';
import { Sidebar, NavItem } from './Sidebar';
import { useAuthStore } from '@/features/auth/store/authStore';

const operatorNavItems: NavItem[] = [
  {
    label: 'Очередь',
    href: '/operator/queue',
    icon: Inbox,
  },
  {
    label: 'Мои заявки',
    href: '/operator/my-tickets',
    icon: ListChecks,
  },
  {
    label: 'Шаблоны',
    href: '/operator/templates',
    icon: FileText,
  },
];

export const OperatorLayout = () => {
  console.log('🏗️ OperatorLayout rendering');
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();

  if (!user) {
    console.error('❌ OperatorLayout: No user found!');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        variant="operator"
        user={user}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onLogout={logout}
      />

      <div className="flex">
        <div className="hidden md:block">
          <Sidebar items={operatorNavItems} />
        </div>

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

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
