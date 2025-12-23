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
  console.log('🏗️ ClientLayout rendering');
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore(); // ← Используем РЕАЛЬНОГО пользователя

  console.log('🏗️ ClientLayout user:', user);

  // Если пользователя нет (не должно происходить, но на всякий случай)
  if (!user) {
    console.error('❌ ClientLayout: No user found!');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        variant="client"
        user={user} // ← Передаём реального пользователя
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onLogout={logout} // ← Используем реальный logout
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
