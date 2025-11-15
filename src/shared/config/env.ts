// Типизированный доступ к переменным окружения
function getEnvVar(key: string, defaultValue?: string): string {
  const value = (import.meta as any).env[key];
  return value !== undefined ? value : (defaultValue || '');
}

function getBoolEnvVar(key: string, defaultValue = false): boolean {
  const value = (import.meta as any).env[key];
  return value === 'true' || (value === undefined && defaultValue);
}

function getNumberEnvVar(key: string, defaultValue: number): number {
  const value = (import.meta as any).env[key];
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

export const env = {
  // API
  apiUrl: getEnvVar('VITE_API_URL', 'http://localhost:3000/api'),
  wsUrl: getEnvVar('VITE_WS_URL', 'http://localhost:3000'),

  // App
  appName: getEnvVar('VITE_APP_NAME', 'HelpMate'),
  appVersion: getEnvVar('VITE_APP_VERSION', '1.0.0'),

  // Features
  enableAnalytics: getBoolEnvVar('VITE_ENABLE_ANALYTICS', true),
  maxFileSize: getNumberEnvVar('VITE_MAX_FILE_SIZE', 10485760),
  maxFilesPerTicket: getNumberEnvVar('VITE_MAX_FILES_PER_TICKET', 5),

  // Environment
  isDev: (import.meta as any).env.DEV as boolean,
  isProd: (import.meta as any).env.PROD as boolean,
  mode: (import.meta as any).env.MODE as string,
} as const;

// Валидация обязательных переменных
export const validateEnv = (): void => {
  const requiredVars = ['VITE_API_URL'];
  
  const missing = requiredVars.filter(
    (key) => !(import.meta as any).env[key]
  );

  if (missing.length > 0 && env.isProd) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
};
