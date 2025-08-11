/**
 * Centralized constants for La Económica application
 * This file contains all the configuration constants used throughout the app
 */

// App Configuration
export const APP_CONFIG = {
  NAME: "La Económica",
  VERSION: "1.0.0",
  DESCRIPTION: "Tu convenience store digital con entrega ultrarrápida",
  DOMAIN: "laeconomica.com",
  SUPPORT_EMAIL: "soporte@laeconomica.com",
  PHONE: "+52 55 1234 5678",
} as const;

// Store Configuration
export const STORE_CONFIG = {
  HOURS: {
    OPEN: "09:00",
    CLOSE: "21:00", // Extended hours
    TIMEZONE: "America/Mexico_City",
    DAYS: [
      "Lunes",
      "Martes", 
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ],
  },
  ADDRESS: {
    STREET: "Av. Reforma 123",
    CITY: "Ciudad de México",
    STATE: "CDMX",
    POSTAL_CODE: "01000",
    COUNTRY: "México",
  },
  DELIVERY: {
    DEFAULT_TIME: "15-20 min",
    EXPRESS_TIME: "10-15 min", 
    EXTENDED_TIME: "30-45 min",
    FREE_SHIPPING_THRESHOLD: 300, // Pesos
    DELIVERY_FEE: 35, // Pesos
    EXPRESS_FEE: 55, // Pesos
  },
} as const;

// Cart Configuration
export const CART_CONFIG = {
  STORAGE_KEY: "la_economica_cart",
  MAX_ITEMS: 99,
  MAX_DIFFERENT_PRODUCTS: 50,
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours in ms
  AUTO_SAVE_INTERVAL: 5000, // 5 seconds
} as const;

// Product Configuration
export const PRODUCT_CONFIG = {
  WEIGHT: {
    KG_MIN_STEP: 0.1, // 100g minimum
    GRAM_MIN_STEP: 100, // 100g minimum
    LITER_MIN_STEP: 0.1, // 100ml minimum
    MAX_WEIGHT: 10, // 10kg maximum per item
    MAX_VOLUME: 5, // 5L maximum per item
  },
  STOCK: {
    LOW_STOCK_THRESHOLD: 5,
    OUT_OF_STOCK_THRESHOLD: 0,
    REORDER_POINT: 10,
  },
  IMAGES: {
    PLACEHOLDER: "/api/placeholder/400x300",
    FALLBACK_SVG: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='200' y='150' text-anchor='middle' dy='0.3em' font-family='system-ui' font-size='16' fill='%239ca3af'%3EImagen no disponible%3C/text%3E%3C/svg%3E",
    SIZES: {
      THUMBNAIL: "80x80",
      SMALL: "200x200", 
      MEDIUM: "400x400",
      LARGE: "800x800",
    },
  },
  RATING: {
    MIN: 1,
    MAX: 5,
    DEFAULT: 4.0,
  },
} as const;

// User Configuration
export const USER_CONFIG = {
  ROLES: {
    CUSTOMER: "CUSTOMER",
    LEVEL_1_CASHIER: "LEVEL_1_CASHIER",
    LEVEL_2_SUPERVISOR: "LEVEL_2_SUPERVISOR", 
    LEVEL_3_MANAGER: "LEVEL_3_MANAGER",
    LEVEL_4_OWNER: "LEVEL_4_OWNER",
    LEVEL_5_DEVELOPER: "LEVEL_5_DEVELOPER",
  },
  SESSION: {
    STORAGE_KEY: "la_economica_auth",
    TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes
    MAX_LOGIN_ATTEMPTS: 3,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  },
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 6,
    MAX_PASSWORD_LENGTH: 128,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
  },
} as const;

// Payment Configuration
export const PAYMENT_CONFIG = {
  METHODS: {
    CARD: "card",
    CASH: "cash",
    TRANSFER: "transfer",
    OXXO: "oxxo",
  },
  STRIPE: {
    CURRENCY: "MXN",
    COUNTRY: "MX",
    PAYMENT_METHOD_TYPES: ["card", "oxxo"],
  },
  LIMITS: {
    MIN_AMOUNT: 50, // Minimum order: $50 pesos
    MAX_AMOUNT: 10000, // Maximum order: $10,000 pesos
    CASH_LIMIT: 2000, // Cash payments up to $2,000 pesos
  },
} as const;

// UI Configuration
export const UI_CONFIG = {
  THEME: {
    DEFAULT_FONT: "Inter",
    BRAND_COLORS: {
      PRIMARY: "#f97316", // Orange-500
      SECONDARY: "#22c55e", // Green-500  
      ACCENT: "#eab308", // Yellow-500
      DANGER: "#ef4444", // Red-500
    },
  },
  ANIMATIONS: {
    DURATION_FAST: 150, // ms
    DURATION_NORMAL: 300, // ms
    DURATION_SLOW: 500, // ms
  },
  RESPONSIVE: {
    MOBILE_BREAKPOINT: 640, // px
    TABLET_BREAKPOINT: 768, // px
    DESKTOP_BREAKPOINT: 1024, // px
  },
  NOTIFICATIONS: {
    DEFAULT_DURATION: 3000, // ms
    SUCCESS_DURATION: 2000, // ms
    ERROR_DURATION: 5000, // ms
  },
} as const;

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:5000",
  ENDPOINTS: {
    AUTH: "/api/auth",
    PRODUCTS: "/api/products",
    CART: "/api/cart", 
    ORDERS: "/api/orders",
    PAYMENTS: "/api/payments",
    USERS: "/api/users",
    CATEGORIES: "/api/categories",
    REPORTS: "/api/reports",
  },
  TIMEOUTS: {
    DEFAULT: 10000, // 10 seconds
    UPLOAD: 30000, // 30 seconds
    PAYMENT: 60000, // 60 seconds
  },
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000, // 1 second
    BACKOFF_FACTOR: 2,
  },
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_VOICE_SEARCH: false,
  ENABLE_RECOMMENDATIONS: true,
  ENABLE_LOYALTY_PROGRAM: true,
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_OFFLINE_MODE: true,
  ENABLE_ANALYTICS: true,
  ENABLE_A_B_TESTING: false,
  ENABLE_DARK_MODE: false, // Coming soon
  ENABLE_MULTI_LANGUAGE: false, // Coming soon
} as const;

// Performance Configuration
export const PERFORMANCE_CONFIG = {
  LAZY_LOADING: {
    IMAGE_MARGIN: "50px", // Start loading 50px before visible
    COMPONENT_MARGIN: "100px",
  },
  CACHE: {
    API_CACHE_TIME: 5 * 60 * 1000, // 5 minutes
    IMAGE_CACHE_SIZE: 50 * 1024 * 1024, // 50MB
    LOCAL_STORAGE_LIMIT: 5 * 1024 * 1024, // 5MB
  },
  VIRTUALIZATION: {
    ITEM_HEIGHT: 200, // px
    BUFFER_SIZE: 5, // Items to render outside viewport
    OVERSCAN: 2, // Additional items for smooth scrolling
  },
} as const;

// Error Handling
export const ERROR_CONFIG = {
  TYPES: {
    NETWORK: "network",
    CART: "cart", 
    PAYMENT: "payment",
    AUTH: "auth",
    VALIDATION: "validation",
    SERVER: "server",
    CLIENT: "client",
  },
  MESSAGES: {
    NETWORK: "Error de conexión. Verifica tu internet.",
    CART: "Error en el carrito. Intenta de nuevo.",
    PAYMENT: "Error en el pago. No se realizó ningún cargo.",
    AUTH: "Error de autenticación. Inicia sesión nuevamente.",
    VALIDATION: "Datos inválidos. Revisa la información.",
    SERVER: "Error del servidor. Intenta más tarde.",
    CLIENT: "Error inesperado. Recarga la página.",
    GENERAL: "Ha ocurrido un error. Intenta nuevamente.",
  },
  RETRY_DELAYS: [1000, 2000, 4000], // Progressive delays in ms
} as const;

// Analytics Configuration
export const ANALYTICS_CONFIG = {
  EVENTS: {
    PAGE_VIEW: "page_view",
    PRODUCT_VIEW: "product_view",
    ADD_TO_CART: "add_to_cart",
    REMOVE_FROM_CART: "remove_from_cart",
    PURCHASE: "purchase",
    SEARCH: "search",
    LOGIN: "login",
    REGISTER: "register",
  },
  TRACKING: {
    ENABLE_USER_TRACKING: true,
    ENABLE_PERFORMANCE_TRACKING: true,
    ENABLE_ERROR_TRACKING: true,
    SAMPLE_RATE: 1.0, // 100% sampling
  },
} as const;

// SEO Configuration
export const SEO_CONFIG = {
  META: {
    DEFAULT_TITLE: "La Económica - Convenience Store Digital",
    TITLE_TEMPLATE: "%s | La Económica",
    DEFAULT_DESCRIPTION: "Tu convenience store digital con entrega ultrarrápida. Miles de productos, inventario en tiempo real, entrega en 15 minutos.",
    KEYWORDS: "convenience store, entrega rápida, productos frescos, abarrotes, CDMX",
    AUTHOR: "La Económica",
    ROBOTS: "index, follow",
  },
  SOCIAL: {
    OG_TYPE: "website",
    OG_SITE_NAME: "La Económica",
    TWITTER_CARD: "summary_large_image",
    TWITTER_SITE: "@laeconomica",
  },
} as const;

// Development Configuration
export const DEV_CONFIG = {
  DEBUG: process.env.NODE_ENV === "development",
  VERBOSE_LOGGING: process.env.NODE_ENV === "development",
  MOCK_API: false,
  ENABLE_DEVTOOLS: process.env.NODE_ENV === "development",
  HOT_RELOAD: true,
} as const;

// Type exports for better TypeScript support
export type AppConfig = typeof APP_CONFIG;
export type StoreConfig = typeof STORE_CONFIG;
export type CartConfig = typeof CART_CONFIG;
export type ProductConfig = typeof PRODUCT_CONFIG;
export type UserConfig = typeof USER_CONFIG;
export type PaymentConfig = typeof PAYMENT_CONFIG;
export type UIConfig = typeof UI_CONFIG;
export type APIConfig = typeof API_CONFIG;
export type FeatureFlags = typeof FEATURE_FLAGS;
export type PerformanceConfig = typeof PERFORMANCE_CONFIG;
export type ErrorConfig = typeof ERROR_CONFIG;
export type AnalyticsConfig = typeof ANALYTICS_CONFIG;
export type SEOConfig = typeof SEO_CONFIG;
export type DevConfig = typeof DEV_CONFIG;

// Combined configuration object
export const CONFIG = {
  APP: APP_CONFIG,
  STORE: STORE_CONFIG,
  CART: CART_CONFIG,
  PRODUCT: PRODUCT_CONFIG,
  USER: USER_CONFIG,
  PAYMENT: PAYMENT_CONFIG,
  UI: UI_CONFIG,
  API: API_CONFIG,
  FEATURES: FEATURE_FLAGS,
  PERFORMANCE: PERFORMANCE_CONFIG,
  ERROR: ERROR_CONFIG,
  ANALYTICS: ANALYTICS_CONFIG,
  SEO: SEO_CONFIG,
  DEV: DEV_CONFIG,
} as const;

export default CONFIG;
