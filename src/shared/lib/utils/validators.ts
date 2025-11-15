import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from './constants';

// Валидация email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Валидация телефона (российский формат)
export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 11 && cleaned.startsWith('7');
};

// Валидация файла
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Проверка размера
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Файл слишком большой. Максимум ${MAX_FILE_SIZE / 1024 / 1024}МБ`,
    };
  }

  // Проверка типа
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Недопустимый тип файла',
    };
  }

  return { valid: true };
};

// Валидация пароля
export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Минимум 8 символов');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Хотя бы одна заглавная буква');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Хотя бы одна строчная буква');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Хотя бы одна цифра');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
