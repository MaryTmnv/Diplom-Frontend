import { Link } from 'react-router-dom';
import { Menu, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { NotificationBell } from '@/features/notifications/components/NotificationBell';
import { Avatar, Button, DropdownMenu, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/shared/ui';
import { AvatarImage, AvatarFallback } from '@/shared/ui/Avatar';
import { DropdownMenuTrigger, DropdownMenuContent } from '@/shared/ui/DropdownMenu';
import { UserType } from '@/shared/types/user.types';

interface HeaderProps {
  variant: 'public' | 'client' | 'operator' | 'manager';
  user?:  UserType,
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
    <header className="sticky top-0 z-40 w-full border-b border-[#90e0ef]/50 bg-white/95 backdrop-blur-md shadow-sm">
  <div className="container mx-auto flex h-18 items-center justify-between px-4">
    
    {/* Левая часть: Меню (mobile) + Лого */}
    <div className="flex items-center gap-4">
      {/* Кнопка меню (только для авторизованных на мобильных) */}
      {!isPublic && (
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-[#023e8a] hover:bg-[#caf0f8] hover:text-[#0077b6] transition-colors"
          onClick={onMenuClick}
          aria-label="Открыть меню"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Лого */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 bg-gradient-to-br from-[#0077b6] to-[#03045e] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
          <span className="text-white font-bold text-xl">H</span>
        </div>
        <span className="font-bold text-xl text-[#03045e] hidden sm:inline-block group-hover:text-[#0077b6] transition-colors duration-300">
          HelpMate
        </span>
      </Link>
    </div>

    {/* Центр: Навигация (для публичной версии) */}
    {isPublic && (
      <nav className="hidden md:flex items-center gap-1">
        <Link
          to="/"
          className="relative px-4 py-2 text-sm font-medium text-[#023e8a]/80 hover:text-[#0077b6] transition-colors rounded-lg hover:bg-[#caf0f8]/50 group"
        >
          Главная
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#0077b6] group-hover:w-1/2 transition-all duration-300 rounded-full" />
        </Link>
        <Link
          to="/knowledge-base"
          className="relative px-4 py-2 text-sm font-medium text-[#023e8a]/80 hover:text-[#0077b6] transition-colors rounded-lg hover:bg-[#caf0f8]/50 group"
        >
          База знаний
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#0077b6] group-hover:w-1/2 transition-all duration-300 rounded-full" />
        </Link>
      </nav>
    )}

    {/* Правая часть */}
    <div className="flex items-center gap-2">
      {isPublic ? (
        // Публичная версия - кнопки входа/регистрации
        <>
          <Link to="/auth/login">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-[#023e8a] hover:text-[#0077b6] hover:bg-[#caf0f8]/50 font-medium transition-all"
            >
              Войти
            </Button>
          </Link>
          <Link to="/auth/register">
            <Button 
              size="sm"
              className="bg-gradient-to-r from-[#0077b6] to-[#023e8a] hover:from-[#0096c7] hover:to-[#0077b6] text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 rounded-xl px-5"
            >
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
                className="relative h-11 gap-3 px-2 hover:bg-[#caf0f8]/50 rounded-xl transition-all duration-200 group"
              >
                <Avatar className="h-9 w-9 ring-2 ring-[#90e0ef] ring-offset-2 group-hover:ring-[#0077b6] transition-all">
                 {user?.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.firstName} />
                  ) : (
                    <AvatarFallback>
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-semibold text-[#03045e]">
                    {user?.firstName}
                  </span>
                  {/* <span className="text-xs text-[#023e8a]/60">
                    {user?.role === 'client' && 'Клиент'}
                    {user?.role === 'operator' && 'Оператор'}
                    {user?.role === 'manager' && 'Руководитель'}
                  </span> */}
                </div>
                <ChevronDown className="h-4 w-4 text-[#023e8a]/50 hidden md:block group-hover:text-[#0077b6] transition-colors" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent 
              align="end" 
              className="w-64 p-2 rounded-2xl border border-[#90e0ef]/50 shadow-xl bg-white/95 backdrop-blur-md"
            >
              <DropdownMenuLabel className="px-3 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-[#90e0ef]">
                    {user?.avatar ? (
                        <AvatarImage src={user.avatar} alt={user.firstName} />
                      ) : (
                        <AvatarFallback>
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </AvatarFallback>
                      )}
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-[#03045e]">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-[#023e8a]/60">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="bg-[#90e0ef]/30 my-2" />

              {/* Динамический путь к профилю */}
              <DropdownMenuItem asChild>
                <Link 
                  to={`${basePath}/profile`} 
                  className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#023e8a] hover:bg-[#caf0f8]/50 hover:text-[#0077b6] transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#caf0f8] flex items-center justify-center">
                    <User className="h-4 w-4 text-[#0077b6]" />
                  </div>
                  <span className="font-medium">Профиль</span>
                </Link>
              </DropdownMenuItem>

              {/* Динамический путь к настройкам */}
              <DropdownMenuItem asChild>
                <Link 
                  to={`${basePath}/settings`} 
                  className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#023e8a] hover:bg-[#caf0f8]/50 hover:text-[#0077b6] transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#caf0f8] flex items-center justify-center">
                    <Settings className="h-4 w-4 text-[#0077b6]" />
                  </div>
                  <span className="font-medium">Настройки</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-[#90e0ef]/30 my-2" />

              <DropdownMenuItem
                onClick={onLogout}
                className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <LogOut className="h-4 w-4 text-red-500" />
                </div>
                <span className="font-medium">Выйти</span>
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
