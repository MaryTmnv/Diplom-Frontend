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
  totalTickets: number;
  resolvedTickets: number;
}

export interface OperatorStats {
  totalResolved: number;
  averageResolutionTime: number;  // в минутах
  averageRating: number;          // 0-5
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
