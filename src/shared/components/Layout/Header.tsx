import { Link } from 'react-router-dom';
import { Bell, Menu, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Avatar } from '@/shared/ui/Avatar';
import { DropdownMenu, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/shared/ui/DropdownMenu';

interface HeaderProps {
  variant: 'public' | 'client' | 'operator' | 'manager';
  user?: {
    firstName: string;
    lastName: string;
    avatar?: string;
    email: string;
  };
  unreadNotifications?: number;
  onMenuClick?: () => void;
  onLogout?: () => void;
}

export const Header = ({
  variant,
  user,
  unreadNotifications = 0,
  onMenuClick,
  onLogout,
}: HeaderProps) => {
  const isPublic = variant === 'public';

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4">
        
        {/* Левая часть */}
        <div className="flex items-center gap-4">
          {!isPublic && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}

          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">
              HelpMate
            </span>
          </Link>
        </div>

        {/* Центр */}
        {isPublic && (
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
              Главная
            </Link>
            <Link to="/knowledge-base" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
              База знаний
            </Link>
          </nav>
        )}

        {/* Правая часть */}
        <div className="flex items-center gap-3">
          {isPublic ? (
            <>
              <Link to="/auth/login">
                <Button variant="ghost" size="sm">Войти</Button>
              </Link>
              <Link to="/auth/register">
                <Button size="sm">Регистрация</Button>
              </Link>
            </>
          ) : (
            <>
              {/* Уведомления */}
              <div className="relative">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 flex items-center justify-center bg-red-600 text-white text-xs font-semibold rounded-full">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </div>

              {/* Меню пользователя */}
              <DropdownMenu
                align="end"
                trigger={
                  <Button variant="ghost" className="h-10 gap-2 px-2">
                    <Avatar
                      src={user?.avatar}
                      alt={user?.firstName}
                      fallback={`${user?.firstName?.[0]}${user?.lastName?.[0]}`}
                      size="md"
                    />
                    <span className="hidden md:inline-block text-sm font-medium">
                      {user?.firstName}
                    </span>
                  </Button>
                }
              >
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => window.location.href = '/profile'}>
                  <User className="mr-2 h-4 w-4" />
                  Профиль
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
                  <Settings className="mr-2 h-4 w-4" />
                  Настройки
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={onLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Выйти
                </DropdownMenuItem>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
