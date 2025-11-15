import { PaginatedResponse, DateRangeFilter } from '@/shared/types/api.types';

// ========== ENUMS (UPPERCASE как на бэкенде) ==========

export enum TicketStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING = 'WAITING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum TicketCategory {
  CARDS = 'CARDS',
  DEPOSITS = 'DEPOSITS',
  LOANS = 'LOANS',
  MOBILE_APP = 'MOBILE_APP',
  PAYMENTS = 'PAYMENTS',
  SECURITY = 'SECURITY',
  OTHER = 'OTHER',
}

export enum TicketEventType {
  CREATED = 'CREATED',
  ASSIGNED = 'ASSIGNED',
  STATUS_CHANGED = 'STATUS_CHANGED',
  PRIORITY_CHANGED = 'PRIORITY_CHANGED',
  ESCALATED = 'ESCALATED',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  REOPENED = 'REOPENED',
}

// ========== INTERFACES ==========

export interface Ticket {
  id: string;
  number: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  clientId: string;
  client?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string | null;
    clientProfile?: {
      isVip: boolean;
    };
  };
  operatorId?: string | null;
  operator?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
    operatorStats?: {
      totalResolved: number;
      averageResolutionTime: number;
      averageRating: number;
    };
  } | null;
  createdAt: string;
  updatedAt: string;
  assignedAt?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  contextData?: Record<string, any> | null;
  unreadCount?: number;
}

export interface Message {
  id: string;
  ticketId: string;
  authorId: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
    role: string;
  };
  content: string;
  isInternal: boolean;
  createdAt: string;
  readAt?: string | null;
  attachments: Attachment[];
}

export interface Attachment {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
}

export interface InternalNote {
  id: string;
  ticketId: string;
  authorId: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
  };
  content: string;
  createdAt: string;
}

export interface TicketEvent {
  id: string;
  ticketId: string;
  type: TicketEventType;
  description: string;
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
  metadata?: Record<string, any> | null;
  createdAt: string;
}

export interface TicketRating {
  id: string;
  ticketId: string;
  clientId: string;
  rating: number; // 1-5
  feedback?: string | null;
  likedSpeed: boolean;
  likedClarity: boolean;
  likedPoliteness: boolean;
  likedCompleteness: boolean;
  createdAt: string;
}

// ========== DETAIL (полная информация) ==========

export interface TicketDetail extends Ticket {
  messages: Message[];
  internalNotes?: InternalNote[];
  attachments: Attachment[];
  events: TicketEvent[];
  rating?: TicketRating | null;
  suggestions?: {
    similarTickets: Ticket[];
    articles: Article[];
  };
}

// Временный тип Article (создадим позже в knowledge-base)
interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readingTime: number;
}

// ========== DTO ==========

export interface CreateTicketDto {
  title: string;
  description: string;
  category: TicketCategory;
  attachmentIds?: string[];
  contextData?: {
    device?: string;
    os?: string;
    appVersion?: string;
    browser?: string;
    [key: string]: any;
  };
}

export interface UpdateTicketStatusDto {
  status: TicketStatus;
  comment?: string;
}

export interface UpdateTicketPriorityDto {
  priority: TicketPriority;
  reason?: string;
}

export interface EscalateTicketDto {
  specialistId: string;
  reason: string;
  notifyClient?: boolean;
}

export interface AddInternalNoteDto {
  content: string;
}

export interface RateTicketDto {
  rating: number; // 1-5
  feedback?: string;
  likedSpeed?: boolean;
  likedClarity?: boolean;
  likedPoliteness?: boolean;
  likedCompleteness?: boolean;
}

// ========== FILTERS ==========

export interface TicketFilters extends DateRangeFilter {
  status?: TicketStatus[];
  priority?: TicketPriority[];
  category?: TicketCategory[];
  search?: string;
  page?: number;
  limit?: number;
}

export interface QueueFilters {
  priority?: TicketPriority[];
  category?: TicketCategory[];
  page?: number;
  limit?: number;
}

// ========== RESPONSES ==========

export type TicketsResponse = PaginatedResponse<Ticket>;
