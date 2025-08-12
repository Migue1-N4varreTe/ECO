// Configuración de environment para diferentes ambientes

interface Environment {
  apiUrl: string;
  environment: string;
  isDevelopment: boolean;
  isProduction: boolean;
  isStaging: boolean;
  stripePublishableKey: string;
  sentryDsn?: string;
  enableAnalytics: boolean;
  enableDebug: boolean;
}

// Detectar ambiente basado en URL o variables
const detectEnvironment = (): 'development' | 'staging' | 'production' => {
  if (import.meta.env.DEV) return 'development';
  
  const hostname = window.location.hostname;
  
  if (hostname.includes('staging') || hostname.includes('dev')) {
    return 'staging';
  }
  
  return 'production';
};

const currentEnv = detectEnvironment();

// Configuraciones por ambiente
const environments: Record<string, Environment> = {
  development: {
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    environment: 'development',
    isDevelopment: true,
    isProduction: false,
    isStaging: false,
    stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...',
    sentryDsn: undefined,
    enableAnalytics: false,
    enableDebug: true,
  },
  
  staging: {
    apiUrl: import.meta.env.VITE_API_URL || 'https://api-staging.la-economica.railway.app',
    environment: 'staging',
    isDevelopment: false,
    isProduction: false,
    isStaging: true,
    stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...',
    sentryDsn: import.meta.env.VITE_SENTRY_DSN,
    enableAnalytics: false,
    enableDebug: true,
  },
  
  production: {
    apiUrl: import.meta.env.VITE_API_URL || 'https://api.la-economica.railway.app',
    environment: 'production',
    isDevelopment: false,
    isProduction: true,
    isStaging: false,
    stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
    sentryDsn: import.meta.env.VITE_SENTRY_DSN,
    enableAnalytics: true,
    enableDebug: false,
  },
};

// Exportar configuración actual
export const config: Environment = environments[currentEnv];

// Utilidades adicionales
export const isClient = typeof window !== 'undefined';

export const getApiUrl = (endpoint: string = ''): string => {
  const baseUrl = config.apiUrl.replace(/\/$/, ''); // Remover trailing slash
  const cleanEndpoint = endpoint.replace(/^\//, ''); // Remover leading slash
  return cleanEndpoint ? `${baseUrl}/${cleanEndpoint}` : baseUrl;
};

export const logEnvironmentInfo = (): void => {
  if (config.enableDebug) {
    console.group('🌍 Environment Configuration');
    console.log('Environment:', config.environment);
    console.log('API URL:', config.apiUrl);
    console.log('Debug Mode:', config.enableDebug);
    console.log('Analytics:', config.enableAnalytics);
    console.groupEnd();
  }
};

// Log info en desarrollo
if (config.isDevelopment) {
  logEnvironmentInfo();
}

export default config;
