import { z } from 'zod';

// ========== Login Schema ==========
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email обязателен')
    .email('Некорректный email'),
  password: z
    .string()
    .min(8, 'Минимум 8 символов')
    .max(100, 'Максимум 100 символов'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ========== Register Schema ==========
export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, 'Минимум 2 символа')
      .max(50, 'Максимум 50 символов')
      .regex(/^[а-яА-ЯёЁa-zA-Z\s-]+$/, 'Только буквы, пробелы и дефисы'),
    lastName: z
      .string()
      .min(2, 'Минимум 2 символа')
      .max(50, 'Максимум 50 символов')
      .regex(/^[а-яА-ЯёЁa-zA-Z\s-]+$/, 'Только буквы, пробелы и дефисы'),
    email: z
      .string()
      .min(1, 'Email обязателен')
      .email('Некорректный email'),
    phone: z
      .string()
      .min(1, 'Телефон обязателен')
      .regex(/^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/, 
        'Некорректный номер телефона'),
    password: z
      .string()
      .min(8, 'Минимум 8 символов')
      .max(100, 'Максимум 100 символов')
      .regex(/[A-Z]/, 'Должна быть хотя бы одна заглавная буква')
      .regex(/[a-z]/, 'Должна быть хотя бы одна строчная буква')
      .regex(/[0-9]/, 'Должна быть хотя бы одна цифра'),
    confirmPassword: z.string().min(1, 'Подтвердите пароль'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

// ========== Forgot Password Schema ==========
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email обязателен')
    .email('Некорректный email'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// ========== Reset Password Schema ==========
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Минимум 8 символов')
      .max(100, 'Максимум 100 символов')
      .regex(/[A-Z]/, 'Должна быть хотя бы одна заглавная буква')
      .regex(/[a-z]/, 'Должна быть хотя бы одна строчная буква')
      .regex(/[0-9]/, 'Должна быть хотя бы одна цифра'),
    confirmPassword: z.string().min(1, 'Подтвердите пароль'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
