

// Валидация обязательных переменных при запуске
const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key] || defaultValue;
  
  if (!value && !defaultValue) {
    console.warn(`⚠️ Missing environment variable: ${key}`);
  }
  
  return value || '';
};

export const env = {
  // API
  apiUrl: getEnvVar('VITE_API_URL', 'http://localhost:3000/api'),
  wsUrl: getEnvVar('VITE_WS_URL', 'http://localhost:3000'),
  
  // App
  appName: getEnvVar('VITE_APP_NAME', 'HelpMate'),
  appVersion: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  
  // Features
  enableAnalytics: getEnvVar('VITE_ENABLE_ANALYTICS', 'false') === 'true',
  maxFileSize: Number(getEnvVar('VITE_MAX_FILE_SIZE', '10485760')),
  maxFilesPerTicket: Number(getEnvVar('VITE_MAX_FILES_PER_TICKET', '5')),
  
  // External
  sentryDsn: getEnvVar('VITE_SENTRY_DSN', ''),
  
  // Режимы
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  mode: import.meta.env.MODE,
} as const;

// Логируем конфиг при запуске (только в dev)
if (env.isDev) {
  console.log('🔧 Environment config:', {
    apiUrl: env.apiUrl,
    wsUrl: env.wsUrl,
    mode: env.mode,
  });
}
