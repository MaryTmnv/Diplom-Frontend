// Константы приложения
export const APP_NAME = 'HelpMate';
export const APP_VERSION = '1.0.0';

// Лимиты
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_FILES_PER_TICKET = 5;
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// Таймауты
export const DEBOUNCE_DELAY = 300; // мс
export const TOAST_DURATION = 4000; // мс
export const TYPING_INDICATOR_TIMEOUT = 3000; // мс

// API
export const API_TIMEOUT = 30000; // 30 секунд
export const QUERY_STALE_TIME = 60000; // 1 минута

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const TICKETS_PER_PAGE = 15;
export const ARTICLES_PER_PAGE = 12;
