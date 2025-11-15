import type { User } from "../../../shared/types/user.types";

// Статусы заявок
export const TicketStatus = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  WAITING: 'waiting',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
} as const;

export type TicketStatus = (typeof TicketStatus)[keyof typeof TicketStatus];

// Приоритеты
export const TicketPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export type TicketPriority = (typeof TicketPriority)[keyof typeof TicketPriority];

// Категории
export const TicketCategory = {
  CARDS: 'cards',
  MOBILE_APP: 'mobile_app',
  PAYMENTS: 'payments',
  SECURITY: 'security',
  OTHER: 'other',
} as const;

export type TicketCategory = (typeof TicketCategory)[keyof typeof TicketCategory];

// Типы событий в истории
export const TicketEventType = {
  CREATED: 'created',
  STATUS_CHANGED: 'status_changed',
  PRIORITY_CHANGED: 'priority_changed',
  ASSIGNED: 'assigned',
  ESCALATED: 'escalated',
  COMMENT_ADDED: 'comment_added',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
} as const;

export type TicketEventType = (typeof TicketEventType)[keyof typeof TicketEventType];

// Основной интерфейс заявки
export interface Ticket {
  id: string;
  number: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  clientId: string;
  client?: User;
  operatorId?: string;
  operator?: User;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  unreadCount?: number;
}

// Детальная информация о заявке
export interface TicketDetail extends Ticket {
  messages: Message[];
  history: TicketEvent[];
  attachments: Attachment[];
  internalNotes?: InternalNote[];
  suggestedArticles?: Article[];
  similarTickets?: Ticket[];
  contextData?: Record<string, unknown>;
}

// Создание заявки
export interface CreateTicketDto {
  title: string;
  description: string;
  category: TicketCategory;
  attachments?: File[];
  deviceInfo?: DeviceInfo;
}

// Обновление заявки
export interface UpdateTicketDto {
  status?: TicketStatus;
  priority?: TicketPriority;
  operatorId?: string;
}

// Фильтры заявок
export interface TicketFilters {
  status?: TicketStatus[];
  priority?: TicketPriority[];
  category?: TicketCategory[];
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Событие в истории заявки
export interface TicketEvent {
  id: string;
  ticketId: string;
  type: TicketEventType;
  userId: string;
  user: User;
  data?: Record<string, unknown>;
  createdAt: string;
}

// Внутренняя заметка (только для операторов)
export interface InternalNote {
  id: string;
  ticketId: string;
  authorId: string;
  author: User;
  content: string;
  createdAt: string;
}

// Информация об устройстве
export interface DeviceInfo {
  userAgent: string;
  platform: string;
  screenResolution: string;
  language: string;
}

// Эскалация
export interface EscalateDto {
  reason: string;
  specialistId?: string;
}

// Оценка заявки
export interface RatingDto {
  rating: number; // 1-5
  comment?: string;
}

// Вспомогательные типы (используются в других модулях)
export interface Message {
  id: string;
  ticketId: string;
  authorId: string;
  author: User;
  content: string;
  attachments?: Attachment[];
  isInternal: boolean;
  createdAt: string;
  readAt?: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  views: number;
  helpfulCount: number;
  notHelpfulCount: number;
  readingTime: number;
  createdAt: string;
  updatedAt: string;
}
