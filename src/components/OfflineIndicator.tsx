import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WifiOff, Wifi, RefreshCw, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface OfflineIndicatorProps {
  className?: string;
  showRetryButton?: boolean;
  position?: "top" | "bottom" | "floating";
  variant?: "banner" | "badge" | "alert";
}

const OfflineIndicator = ({
  className,
  showRetryButton = true,
  position = "top",
  variant = "banner",
}: OfflineIndicatorProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        setShowReconnected(true);
        setRetryAttempts(0);
        // Hide "reconnected" message after 3 seconds
        setTimeout(() => setShowReconnected(false), 3000);
      }
      setWasOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Test connection periodically when offline
    let intervalId: NodeJS.Timeout;
    if (!isOnline) {
      intervalId = setInterval(async () => {
        try {
          const response = await fetch('/api/health', { 
            method: 'HEAD',
            cache: 'no-cache',
            signal: AbortSignal.timeout(5000)
          });
          if (response.ok) {
            handleOnline();
          }
        } catch {
          // Still offline
        }
      }, 10000); // Check every 10 seconds
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (intervalId) clearInterval(intervalId);
    };
  }, [isOnline, wasOffline]);

  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryAttempts(prev => prev + 1);

    try {
      // Test connection
      const response = await fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000)
      });
      
      if (response.ok) {
        setIsOnline(true);
        setShowReconnected(true);
        setTimeout(() => setShowReconnected(false), 3000);
      }
    } catch (error) {
      console.log('Connection test failed:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  // Don't render if online and not showing reconnected message
  if (isOnline && !showReconnected) return null;

  const positionClasses = {
    top: "fixed top-0 left-0 right-0 z-50",
    bottom: "fixed bottom-0 left-0 right-0 z-50",
    floating: "fixed top-4 right-4 z-50 max-w-sm",
  };

  // Reconnected state
  if (showReconnected) {
    return (
      <div className={cn(positionClasses[position], className)}>
        <Alert className="border-green-200 bg-green-50 text-green-800 animate-slide-in">
          <Wifi className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>✅ Conexión restablecida</span>
            {position === "floating" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReconnected(false)}
                className="h-6 w-6 p-0 text-green-600 hover:text-green-800"
              >
                ×
              </Button>
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Offline state
  if (variant === "badge") {
    return (
      <Badge 
        variant="destructive" 
        className={cn("animate-pulse", className)}
      >
        <WifiOff className="h-3 w-3 mr-1" />
        Sin conexión
      </Badge>
    );
  }

  if (variant === "alert") {
    return (
      <Alert variant="destructive" className={cn("border-red-200", className)}>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Sin conexión a internet. Algunas funciones pueden no estar disponibles.
        </AlertDescription>
      </Alert>
    );
  }

  // Default banner variant
  return (
    <div className={cn(positionClasses[position], className)}>
      <div className="bg-red-500 text-white px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <WifiOff className="h-5 w-5 animate-pulse" />
            <div>
              <p className="font-medium">Sin conexión a internet</p>
              <p className="text-sm text-red-100">
                Trabajando en modo offline - Los datos pueden no estar actualizados
              </p>
            </div>
          </div>

          {showRetryButton && (
            <div className="flex items-center gap-2">
              {retryAttempts > 0 && (
                <span className="text-sm text-red-100">
                  Intento {retryAttempts}
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                disabled={isRetrying}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Reintentando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reintentar
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfflineIndicator;

// Hook for using offline status in other components
export const useOfflineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, isOffline: !isOnline };
};
