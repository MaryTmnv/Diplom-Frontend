import { z } from 'zod';

// Схема обновления профиля
export const updateProfileSchema = z.object({
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
  
  phone: z
    .string()
    .regex(/^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/, 
      'Некорректный номер телефона')
    .optional()
    .or(z.literal('')),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

// Схема смены пароля
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Введите текущий пароль'),
    
    newPassword: z
      .string()
      .min(8, 'Минимум 8 символов')
      .max(100, 'Максимум 100 символов')
      .regex(/[A-Z]/, 'Должна быть хотя бы одна заглавная буква')
      .regex(/[a-z]/, 'Должна быть хотя бы одна строчная буква')
      .regex(/[0-9]/, 'Должна быть хотя бы одна цифра'),
    
    confirmPassword: z.string().min(1, 'Подтвердите пароль'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'Новый пароль должен отличаться от текущего',
    path: ['newPassword'],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
