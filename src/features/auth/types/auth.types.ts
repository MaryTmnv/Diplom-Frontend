import { UserType } from '@/shared/types/user.types';

// ========== DTO (Data Transfer Objects) ==========

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
}

// ========== Responses (по документации бэкенда) ==========

export interface AuthResponse {
  user: UserType;
  accessToken: string;      // ← изменено с "token"
  refreshToken: string;
  expiresIn: number;        // ← добавлено
}

export interface TokenResponse {
  accessToken: string;      // ← изменено с "token"       
}

// ========== Store State ==========

export interface AuthState {
  user: UserType | null;
  accessToken: string | null;     // ← изменено
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthActions {
  setAuth: (data: AuthResponse) => void;
  setUser: (user: UserType) => void;
  setAccessToken: (token: string) => void;  // ← изменено
  logout: () => void;
  clearAuth: () => void;
}

export type AuthStore = AuthState & AuthActions;
