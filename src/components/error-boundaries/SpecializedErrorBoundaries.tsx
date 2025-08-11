import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertTriangle, 
  RefreshCw, 
  Wifi, 
  ShoppingCart, 
  Package, 
  CreditCard,
  Database,
  ImageIcon,
  Server
} from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface ErrorFallbackProps {
  error: Error;
  errorInfo: React.ErrorInfo;
  resetError: () => void;
}

// Network Error Boundary for API failures
export const NetworkErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
  const isNetworkError = error.message.includes('fetch') || 
                        error.message.includes('network') ||
                        error.message.includes('NetworkError');

  return (
    <Alert variant="destructive" className="my-4">
      <Wifi className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-2">
          <p className="font-medium">
            {isNetworkError ? 'Error de conexión' : 'Error de red'}
          </p>
          <p className="text-sm">
            {isNetworkError 
              ? 'No se pudo conectar al servidor. Verifica tu conexión a internet.'
              : 'Hubo un problema al cargar los datos.'
            }
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={resetError}
            className="mt-2"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Reintentar
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

// Cart Error Boundary for shopping cart issues
export const CartErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
  const isCartError = error.message.includes('cart') || 
                     error.message.includes('quantity') ||
                     error.message.includes('stock');

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-red-800 flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Problema con el carrito
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-red-700 text-sm">
          {isCartError 
            ? 'Hubo un problema al procesar tu carrito de compras.'
            : 'Error inesperado en el carrito.'
          }
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetError}
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Intentar de nuevo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            Recargar página
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Product Error Boundary for product display issues
export const ProductErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
          <Package className="h-5 w-5 text-gray-500" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900">Error al cargar producto</p>
          <p className="text-sm text-gray-600">
            No se pudo mostrar este producto correctamente.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetError}
          className="text-gray-600 hover:text-gray-900"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Payment Error Boundary for checkout issues
export const PaymentErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
  const isPaymentError = error.message.includes('payment') || 
                        error.message.includes('stripe') ||
                        error.message.includes('checkout');

  return (
    <Alert variant="destructive" className="my-4">
      <CreditCard className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-2">
          <p className="font-medium">Error en el pago</p>
          <p className="text-sm">
            {isPaymentError 
              ? 'Hubo un problema al procesar tu pago. No se realizó ningún cargo.'
              : 'Error inesperado durante el checkout.'
            }
          </p>
          <div className="flex gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={resetError}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Intentar de nuevo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/cart'}
            >
              Volver al carrito
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

// Database Error Boundary for data persistence issues
export const DatabaseErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
  return (
    <Alert variant="destructive" className="my-4">
      <Database className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-2">
          <p className="font-medium">Error de base de datos</p>
          <p className="text-sm">
            No se pudieron guardar o cargar los datos. Los cambios recientes pueden perderse.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={resetError}
            className="mt-2"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Reintentar
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

// Image Error Boundary for image loading issues
export const ImageErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
  return (
    <div className="bg-gray-100 border border-gray-200 rounded-lg p-8 text-center">
      <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
      <p className="text-sm text-gray-600 mb-3">Error al cargar imagen</p>
      <Button
        variant="ghost"
        size="sm"
        onClick={resetError}
        className="text-gray-600 hover:text-gray-900"
      >
        <RefreshCw className="h-3 w-3 mr-1" />
        Reintentar
      </Button>
    </div>
  );
};

// Server Error Boundary for 5xx errors
export const ServerErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
  const isServerError = error.message.includes('500') || 
                       error.message.includes('502') ||
                       error.message.includes('503') ||
                       error.message.includes('server');

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-orange-800 flex items-center gap-2">
          <Server className="h-5 w-5" />
          Problema del servidor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-orange-700 text-sm">
          {isServerError 
            ? 'Nuestros servidores están experimentando dificultades técnicas.'
            : 'Error interno del servidor.'
          }
        </p>
        <p className="text-orange-600 text-xs">
          Nuestro equipo técnico ha sido notificado y está trabajando en una solución.
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetError}
            className="border-orange-300 text-orange-700 hover:bg-orange-100"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Reintentar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = '/'}
            className="border-orange-300 text-orange-700 hover:bg-orange-100"
          >
            Ir al inicio
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Specialized error boundary components
export const NetworkErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary fallback={NetworkErrorFallback}>
    {children}
  </ErrorBoundary>
);

export const CartErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary fallback={CartErrorFallback}>
    {children}
  </ErrorBoundary>
);

export const ProductErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary fallback={ProductErrorFallback}>
    {children}
  </ErrorBoundary>
);

export const PaymentErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary fallback={PaymentErrorFallback}>
    {children}
  </ErrorBoundary>
);

export const DatabaseErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary fallback={DatabaseErrorFallback}>
    {children}
  </ErrorBoundary>
);

export const ImageErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary fallback={ImageErrorFallback}>
    {children}
  </ErrorBoundary>
);

export const ServerErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary fallback={ServerErrorFallback}>
    {children}
  </ErrorBoundary>
);

// Hook to determine error type and suggest appropriate boundary
export const useErrorType = (error: Error) => {
  const errorMessage = error.message.toLowerCase();
  
  if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
    return 'network';
  }
  if (errorMessage.includes('cart') || errorMessage.includes('quantity')) {
    return 'cart';
  }
  if (errorMessage.includes('payment') || errorMessage.includes('stripe')) {
    return 'payment';
  }
  if (errorMessage.includes('image') || errorMessage.includes('load')) {
    return 'image';
  }
  if (errorMessage.includes('500') || errorMessage.includes('server')) {
    return 'server';
  }
  if (errorMessage.includes('database') || errorMessage.includes('storage')) {
    return 'database';
  }
  
  return 'general';
};

// Error boundary composer for multiple types
export const ComposedErrorBoundary = ({ 
  children, 
  types = ['network', 'server', 'general'] 
}: { 
  children: React.ReactNode;
  types?: string[];
}) => {
  let wrappedChildren = children;
  
  // Wrap in boundaries based on types (innermost first)
  if (types.includes('payment')) {
    wrappedChildren = (
      <PaymentErrorBoundary>{wrappedChildren}</PaymentErrorBoundary>
    );
  }
  if (types.includes('cart')) {
    wrappedChildren = (
      <CartErrorBoundary>{wrappedChildren}</CartErrorBoundary>
    );
  }
  if (types.includes('database')) {
    wrappedChildren = (
      <DatabaseErrorBoundary>{wrappedChildren}</DatabaseErrorBoundary>
    );
  }
  if (types.includes('network')) {
    wrappedChildren = (
      <NetworkErrorBoundary>{wrappedChildren}</NetworkErrorBoundary>
    );
  }
  if (types.includes('server')) {
    wrappedChildren = (
      <ServerErrorBoundary>{wrappedChildren}</ServerErrorBoundary>
    );
  }
  
  return <>{wrappedChildren}</>;
};
