import { UserRole } from '@/shared/types/user.types';

/**
 * Возвращает путь дашборда в зависимости от роли пользователя
 */
export const getRoleBasePath = (role: UserRole): string => {
  switch (role) {
    case UserRole.CLIENT:
      return '/client/dashboard';
    
    case UserRole.OPERATOR:
    case UserRole.SPECIALIST:
      return '/operator/queue';
    
    case UserRole.MANAGER:
      return '/manager/analytics';
    
    case UserRole.ADMIN:
      return '/manager/analytics'; // Админ тоже видит аналитику
    
    default:
      return '/';
  }
};

/**
 * Возвращает вариант layout для Header
 */
export const getRoleVariant = (role: UserRole): 'client' | 'operator' | 'manager' => {
  switch (role) {
    case UserRole.CLIENT:
      return 'client';
    
    case UserRole.OPERATOR:
    case UserRole.SPECIALIST:
      return 'operator';
    
    case UserRole.MANAGER:
    case UserRole.ADMIN:
      return 'manager';
    
    default:
      return 'client';
  }
};
