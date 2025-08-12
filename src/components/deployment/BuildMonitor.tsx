import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Activity,
  Terminal,
  Download,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

interface BuildLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  duration?: number;
}

interface BuildDetails {
  id: string;
  status: 'building' | 'success' | 'failed' | 'pending';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  branch: string;
  commit: string;
  commitMessage: string;
  author: string;
  logs: BuildLog[];
  progress: number;
  environment: string;
  size?: string;
  deployUrl?: string;
}

interface BuildMonitorProps {
  buildId?: string;
  onClose?: () => void;
}

export default function BuildMonitor({ buildId, onClose }: BuildMonitorProps) {
  const [build, setBuild] = useState<BuildDetails>({
    id: buildId || 'build-001',
    status: 'building',
    startTime: new Date(),
    branch: 'feature/deployment-gui',
    commit: 'a7f9d2e',
    commitMessage: 'feat: add deployment dashboard UI',
    author: 'Fabricio Guzman',
    logs: [],
    progress: 0,
    environment: 'staging'
  });

  const [isLiveMode, setIsLiveMode] = useState(true);

  useEffect(() => {
    if (build.status === 'building' && isLiveMode) {
      const interval = setInterval(() => {
        setBuild(prev => {
          const newProgress = prev.progress + Math.random() * 10;
          const newLog: BuildLog = {
            id: Date.now().toString(),
            timestamp: new Date(),
            level: 'info',
            message: getRandomLogMessage(newProgress),
            duration: Math.random() * 2000
          };

          if (newProgress >= 100) {
            return {
              ...prev,
              status: Math.random() > 0.1 ? 'success' : 'failed',
              progress: 100,
              endTime: new Date(),
              duration: Date.now() - prev.startTime.getTime(),
              logs: [...prev.logs, newLog],
              size: '2.3 MB',
              deployUrl: 'https://staging--la-economica.netlify.app'
            };
          }

          return {
            ...prev,
            progress: newProgress,
            logs: [...prev.logs, newLog].slice(-50) // Mantener solo los últimos 50 logs
          };
        });
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [build.status, isLiveMode]);

  const getRandomLogMessage = (progress: number): string => {
    const messages = [
      `📦 Installing dependencies...`,
      `⚡ Running build scripts...`,
      `🔍 Analyzing bundle size...`,
      `📝 Generating source maps...`,
      `🎨 Processing CSS files...`,
      `🔧 Optimizing images...`,
      `📊 Running type checks...`,
      `🧪 Running tests...`,
      `🚀 Preparing deployment...`,
      `✅ Build completed successfully!`
    ];

    const stepIndex = Math.floor((progress / 100) * (messages.length - 1));
    return messages[stepIndex] || messages[0];
  };

  const getStatusIcon = () => {
    switch (build.status) {
      case 'building':
        return <Activity className="h-5 w-5 text-yellow-500 animate-pulse" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (build.status) {
      case 'building':
        return 'bg-yellow-100 text-yellow-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getLogIcon = (level: BuildLog['level']) => {
    switch (level) {
      case 'error':
        return <XCircle className="h-3 w-3 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-3 w-3 text-yellow-500" />;
      case 'success':
        return <CheckCircle2 className="h-3 w-3 text-green-500" />;
      default:
        return <Clock className="h-3 w-3 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header del build */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <div>
                <CardTitle className="flex items-center gap-2">
                  Build #{build.id}
                  <Badge className={getStatusColor()}>
                    {build.status.charAt(0).toUpperCase() + build.status.slice(1)}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {build.commitMessage} • {build.author}
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLiveMode(!isLiveMode)}
                className={isLiveMode ? 'bg-green-50 border-green-200' : ''}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLiveMode ? 'animate-spin' : ''}`} />
                {isLiveMode ? 'Live' : 'Paused'}
              </Button>
              
              {onClose && (
                <Button variant="outline" size="sm" onClick={onClose}>
                  Cerrar
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Información del commit */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Branch:</span>
              <div className="font-medium">{build.branch}</div>
            </div>
            <div>
              <span className="text-gray-500">Commit:</span>
              <div className="font-mono">{build.commit}</div>
            </div>
            <div>
              <span className="text-gray-500">Environment:</span>
              <div className="font-medium capitalize">{build.environment}</div>
            </div>
            <div>
              <span className="text-gray-500">Started:</span>
              <div>{build.startTime.toLocaleTimeString()}</div>
            </div>
          </div>

          {/* Progreso del build */}
          {build.status === 'building' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Build Progress</span>
                <span>{Math.round(build.progress)}%</span>
              </div>
              <Progress value={build.progress} className="h-2" />
            </div>
          )}

          {/* Información final del build */}
          {build.status !== 'building' && build.status !== 'pending' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Duration:</span>
                <div className="font-medium">
                  {build.duration ? formatDuration(build.duration) : 'N/A'}
                </div>
              </div>
              {build.size && (
                <div>
                  <span className="text-gray-500">Size:</span>
                  <div className="font-medium">{build.size}</div>
                </div>
              )}
              {build.endTime && (
                <div>
                  <span className="text-gray-500">Finished:</span>
                  <div>{build.endTime.toLocaleTimeString()}</div>
                </div>
              )}
              {build.deployUrl && build.status === 'success' && (
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(build.deployUrl, '_blank')}
                    className="h-8"
                  >
                    <ExternalLink className="h-3 w-3 mr-2" />
                    Ver Deploy
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Logs del build */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Build Logs
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {build.logs.length} entries
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-2 font-mono text-sm">
              {build.logs.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No hay logs disponibles aún...
                </div>
              ) : (
                build.logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 p-2 rounded hover:bg-gray-50">
                    <div className="flex items-center gap-2 text-xs text-gray-500 min-w-20">
                      <span>{log.timestamp.toLocaleTimeString()}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getLogIcon(log.level)}
                    </div>
                    
                    <div className="flex-1">
                      <span className={`${
                        log.level === 'error' ? 'text-red-600' :
                        log.level === 'warning' ? 'text-yellow-600' :
                        log.level === 'success' ? 'text-green-600' :
                        'text-gray-800'
                      }`}>
                        {log.message}
                      </span>
                      
                      {log.duration && (
                        <span className="ml-2 text-xs text-gray-500">
                          ({formatDuration(log.duration)})
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
