import { TicketStatus, TicketPriority, TicketCategory } from "../types/tickets.types";

export const getStatusLabel = (status: TicketStatus, variant: 'default' | 'human' = 'default'): string => {
  if (variant === 'human') {
    const humanLabels: Record<TicketStatus, string> = {
      [TicketStatus.NEW]: 'Мы получили ваше обращение',
      [TicketStatus.IN_PROGRESS]: 'Работаем над этим',
      [TicketStatus.WAITING]: 'Ожидаем ответ от техотдела',
      [TicketStatus.RESOLVED]: 'Проблема решена!',
      [TicketStatus.CLOSED]: 'Заявка закрыта',
    };
    return humanLabels[status];
  }

  const defaultLabels: Record<TicketStatus, string> = {
    [TicketStatus.NEW]: 'Новая',
    [TicketStatus.IN_PROGRESS]: 'В работе',
    [TicketStatus.WAITING]: 'Ожидание',
    [TicketStatus.RESOLVED]: 'Решена',
    [TicketStatus.CLOSED]: 'Закрыта',
  };
  return defaultLabels[status];
};

export const getPriorityLabel = (priority: TicketPriority): string => {
  const labels: Record<TicketPriority, string> = {
    [TicketPriority.LOW]: 'Низкий',
    [TicketPriority.MEDIUM]: 'Средний',
    [TicketPriority.HIGH]: 'Высокий',
    [TicketPriority.CRITICAL]: 'Критический',
  };
  return labels[priority];
};

export const getCategoryLabel = (category: TicketCategory): string => {
  const labels: Record<TicketCategory, string> = {
    [TicketCategory.CARDS]: 'Карты',
    [TicketCategory.DEPOSITS]: 'Вклады',
    [TicketCategory.LOANS]: 'Кредиты',
    [TicketCategory.MOBILE_APP]: 'Мобильное приложение',
    [TicketCategory.PAYMENTS]: 'Платежи',
    [TicketCategory.SECURITY]: 'Безопасность',
    [TicketCategory.OTHER]: 'Другое',
  };
  return labels[category];
};

// ========== ЦВЕТА ==========

export const getStatusColor = (status: TicketStatus): string => {
  const colors: Record<TicketStatus, string> = {
    [TicketStatus.NEW]: 'green',
    [TicketStatus.IN_PROGRESS]: 'blue',
    [TicketStatus.WAITING]: 'yellow',
    [TicketStatus.RESOLVED]: 'purple',
    [TicketStatus.CLOSED]: 'gray',
  };
  return colors[status];
};

export const getPriorityColor = (priority: TicketPriority): string => {
  const colors: Record<TicketPriority, string> = {
    [TicketPriority.LOW]: 'green',
    [TicketPriority.MEDIUM]: 'yellow',
    [TicketPriority.HIGH]: 'orange',
    [TicketPriority.CRITICAL]: 'red',
  };
  return colors[priority];
};

// ========== ИКОНКИ ==========

export const getPriorityIcon = (priority: TicketPriority): string => {
  const icons: Record<TicketPriority, string> = {
    [TicketPriority.LOW]: '🟢',
    [TicketPriority.MEDIUM]: '🟡',
    [TicketPriority.HIGH]: '🟠',
    [TicketPriority.CRITICAL]: '🔴',
  };
  return icons[priority];
};

export const getCategoryIcon = (category: TicketCategory): string => {
  const icons: Record<TicketCategory, string> = {
    [TicketCategory.CARDS]: '💳',
    [TicketCategory.DEPOSITS]: '💰',
    [TicketCategory.LOANS]: '💵',
    [TicketCategory.MOBILE_APP]: '📱',
    [TicketCategory.PAYMENTS]: '💸',
    [TicketCategory.SECURITY]: '🔒',
    [TicketCategory.OTHER]: '📋',
  };
  return icons[category];
};

// ========== ВЫЧИСЛЕНИЯ ==========

// Вычислить время с момента создания
export const getTicketAge = (createdAt: string): string => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 60) return `${diffMins} мин назад`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} ч назад`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} дн назад`;
};

// Проверка просрочки SLA (60 минут)
export const isSLAViolated = (createdAt: string, resolvedAt?: string | null): boolean => {
  const SLA_THRESHOLD = 60; // минут
  
  const created = new Date(createdAt);
  const resolved = resolvedAt ? new Date(resolvedAt) : new Date();
  
  const diffMs = resolved.getTime() - created.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  return diffMins > SLA_THRESHOLD;
};
