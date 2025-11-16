export enum UserRole {
  CLIENT = 'CLIENT',
  OPERATOR = 'OPERATOR',
  SPECIALIST = 'SPECIALIST',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
}

export interface ClientProfile {
  id: string;
  isVip: boolean;
  totalTickets: number;      // ← добавили
  resolvedTickets: number;   // ← добавили
}

export interface OperatorStats {
  totalResolved: number;
  averageResolutionTime: number;
  averageRating: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  avatar?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Профили (опционально, зависит от роли)
  clientProfile?: ClientProfile;
  operatorStats?: OperatorStats;
}
