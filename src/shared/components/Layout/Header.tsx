import { Link } from 'react-router-dom';
import { Menu, User, LogOut, Settings } from 'lucide-react';
import { NotificationBell } from '@/features/notifications/components/NotificationBell';
import { Avatar, Button, DropdownMenu, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/shared/ui';
import { AvatarImage, AvatarFallback } from '@/shared/ui/Avatar';
import { DropdownMenuTrigger, DropdownMenuContent } from '@/shared/ui/DropdownMenu';

interface HeaderProps {
  variant: 'public' | 'client' | 'operator' | 'manager';
  user?: {
    firstName: string;
    lastName: string;
    avatar?: string;
    email: string;
  };
  onMenuClick?: () => void;
  onLogout?: () => void;
}

export const Header = ({
  variant,
  user,
  onMenuClick,
  onLogout,
}: HeaderProps) => {
  const isPublic = variant === 'public';
  
  // Базовый путь в зависимости от роли
  const basePath = isPublic ? '' : `/${variant}`;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        
        {/* Левая часть: Меню (mobile) + Лого */}
        <div className="flex items-center gap-4">
          {/* Кнопка меню (только для авторизованных на мобильных) */}
          {!isPublic && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onMenuClick}
              aria-label="Открыть меню"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}

          {/* Лого */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <span className="font-bold text-xl text-gray-900 hidden sm:inline-block">
              HelpMate
            </span>
          </Link>
        </div>

        {/* Центр: Навигация (для публичной версии) */}
        {isPublic && (
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              Главная
            </Link>
            <Link
              to="/knowledge-base"
              className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              База знаний
            </Link>
          </nav>
        )}

        {/* Правая часть */}
        <div className="flex items-center gap-3">
          {isPublic ? (
            // Публичная версия - кнопки входа/регистрации
            <>
              <Link to="/auth/login">
                <Button variant="ghost" size="sm">
                  Войти
                </Button>
              </Link>
              <Link to="/auth/register">
                <Button size="sm">
                  Регистрация
                </Button>
              </Link>
            </>
          ) : (
            // Авторизованная версия
            <>
              {/* Уведомления */}
              <NotificationBell />

              {/* Меню пользователя */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 gap-2 px-2 hover:bg-gray-100"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.firstName} />
                      <AvatarFallback className="bg-primary-100 text-primary-700 font-semibold">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-block text-sm font-medium text-gray-900">
                      {user?.firstName}
                    </span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  {/* Динамический путь к профилю */}
                  <DropdownMenuItem asChild>
                    <Link to={`${basePath}/profile`} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Профиль
                    </Link>
                  </DropdownMenuItem>

                  {/* Динамический путь к настройкам */}
                  <DropdownMenuItem asChild>
                    <Link to={`${basePath}/settings`} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Настройки
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={onLogout}
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
