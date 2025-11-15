export const UserRole = {
  CLIENT: 'client',
  OPERATOR: 'operator',
  SPECIALIST: 'specialist',
  MANAGER: 'manager',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// Теперь можно использовать:
// UserRole.CLIENT -> 'client'
// type UserRole -> 'client' | 'operator' | 'specialist' | 'manager'

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  ticketsCount?: number;
  resolvedCount?: number;
  rating?: number;
}
