import * as Sentry from "@sentry/node";

const sentryDsn = process.env.VITE_SENTRY_DSN;
const environment = process.env.NODE_ENV || "development";

// Initialize Sentry for Node.js
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment,

    // Performance monitoring
    integrations: [],

    // Performance sampling
    tracesSampleRate: environment === "production" ? 0.1 : 1.0,


    // Error sampling
    sampleRate: 1.0,

    // Release tracking
    release: process.env.npm_package_version,

    // Server name
    serverName: process.env.SERVER_NAME || "la-economica-backend",

    beforeSend(event, hint) {
      // Don't send events in development unless explicitly enabled
      if (environment === "development" && !process.env.SENTRY_DEBUG) {
        return null;
      }

      // Add additional context for backend errors
      if (event.request) {
        // Remove sensitive data from request
        if (event.request.data) {
          event.request.data = sanitizeRequestData(event.request.data);
        }

        if (event.request.headers) {
          // Remove authorization headers
          delete event.request.headers.authorization;
          delete event.request.headers["stripe-signature"];
        }
      }

      return event;
    },

    beforeBreadcrumb(breadcrumb) {
      // Filter out noisy breadcrumbs
      if (breadcrumb.category === "console" && breadcrumb.level !== "error") {
        return null;
      }

      // Don't log sensitive HTTP requests
      if (breadcrumb.category === "http" && breadcrumb.data?.url) {
        if (
          breadcrumb.data.url.includes("/auth/") ||
          breadcrumb.data.url.includes("/payments/")
        ) {
          breadcrumb.data = { ...breadcrumb.data, url: "[REDACTED]" };
        }
      }

      return breadcrumb;
    },
  });

  console.log("✅ Sentry initialized for backend error monitoring");
} else {
  console.warn(
    "⚠️ Sentry DSN not configured - backend error monitoring disabled",
  );
}

// Helper function to sanitize sensitive data
function sanitizeRequestData(data) {
  if (typeof data !== "object" || data === null) {
    return data;
  }

  const sensitiveFields = [
    "password",
    "token",
    "secret",
    "key",
    "authorization",
    "credit_card",
    "cvv",
    "ssn",
    "social_security",
  ];

  const sanitized = { ...data };

  Object.keys(sanitized).forEach((key) => {
    const lowerKey = key.toLowerCase();
    if (sensitiveFields.some((field) => lowerKey.includes(field))) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof sanitized[key] === "object") {
      sanitized[key] = sanitizeRequestData(sanitized[key]);
    }
  });

  return sanitized;
}

// Express middleware for Sentry (SDK v9)
export const sentryRequestHandler = Sentry.expressRequestMiddleware();
export const sentryErrorHandler = Sentry.expressErrorHandler();

// Helper functions for manual error reporting
export const captureError = (error, context = {}) => {
  if (sentryDsn) {
    Sentry.withScope((scope) => {
      // Add context
      Object.keys(context).forEach((key) => {
        scope.setContext(key, context[key]);
      });

      // Add server context
      scope.setContext("server", {
        node_version: process.version,
        platform: process.platform,
        memory_usage: process.memoryUsage(),
        uptime: process.uptime(),
      });

      Sentry.captureException(error);
    });
  } else {
    console.error("Error captured:", error, context);
  }
};

export const captureMessage = (message, level = "info", context = {}) => {
  if (sentryDsn) {
    Sentry.withScope((scope) => {
      scope.setLevel(level);
      Object.keys(context).forEach((key) => {
        scope.setContext(key, context[key]);
      });
      Sentry.captureMessage(message);
    });
  } else {
    console.log(`[${level.toUpperCase()}] ${message}`, context);
  }
};

export const setUser = (user) => {
  if (sentryDsn) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.username || user.name,
      role: user.role,
    });
  }
};

export const clearUser = () => {
  if (sentryDsn) {
    Sentry.setUser(null);
  }
};

export const addBreadcrumb = (
  message,
  category = "manual",
  level = "info",
  data = {},
) => {
  if (sentryDsn) {
    Sentry.addBreadcrumb({
      message,
      category,
      level,
      data,
      timestamp: Date.now() / 1000,
    });
  }
};

// Performance monitoring
export const startTransaction = (name, op = "http.server") => {
  if (sentryDsn) {
    return Sentry.startTransaction({ name, op });
  }
  return null;
};

export default Sentry;
