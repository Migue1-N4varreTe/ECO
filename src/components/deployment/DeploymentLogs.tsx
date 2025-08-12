import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Terminal, 
  Download, 
  Search, 
  Filter,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Info
} from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'success' | 'debug';
  message: string;
  source: string;
  environment: 'development' | 'staging' | 'production';
  buildId?: string;
  duration?: number;
  metadata?: Record<string, any>;
}

interface DeploymentLogsProps {
  buildId?: string;
  environment?: string;
  autoScroll?: boolean;
}

export default function DeploymentLogs({ 
  buildId, 
  environment,
  autoScroll = true 
}: DeploymentLogsProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Simular stream de logs en tiempo real
  useEffect(() => {
    if (!isStreaming) return;

    const generateLog = (): LogEntry => {
      const levels: LogEntry['level'][] = ['info', 'warning', 'error', 'success', 'debug'];
      const sources = ['webpack', 'vite', 'typescript', 'eslint', 'netlify', 'api', 'database'];
      const environments: LogEntry['environment'][] = ['development', 'staging', 'production'];
      
      const messages = [
        'Building application bundle...',
        'Optimizing assets for production...',
        'Type checking completed successfully',
        'Running ESLint checks...',
        'Deploying to CDN...',
        'Connecting to database...',
        'API endpoints registered successfully',
        'Build process completed',
        'Warning: Deprecated dependency detected',
        'Error: Failed to resolve module',
        'Success: All tests passed',
        'Debug: Memory usage: 256MB',
        'Info: Processing 1,247 files...',
        'Bundle size: 2.3MB (gzipped: 847KB)',
        'Uploading assets to storage...',
        'Invalidating cache entries...',
        'Health check passed',
        'SSL certificate validated'
      ];

      const level = levels[Math.floor(Math.random() * levels.length)];
      const source = sources[Math.floor(Math.random() * sources.length)];
      const message = messages[Math.floor(Math.random() * messages.length)];
      const env = environment as LogEntry['environment'] || 
                  environments[Math.floor(Math.random() * environments.length)];

      return {
        id: Date.now().toString() + Math.random(),
        timestamp: new Date(),
        level,
        message,
        source,
        environment: env,
        buildId: buildId || `build-${Math.floor(Math.random() * 1000)}`,
        duration: Math.random() > 0.7 ? Math.floor(Math.random() * 5000) : undefined,
        metadata: {
          memory: `${Math.floor(Math.random() * 512)}MB`,
          cpu: `${Math.floor(Math.random() * 100)}%`
        }
      };
    };

    const interval = setInterval(() => {
      const newLog = generateLog();
      setLogs(prev => {
        const updated = [newLog, ...prev].slice(0, 1000); // Mantener solo los últimos 1000 logs
        return updated;
      });
    }, Math.random() * 3000 + 1000); // Entre 1-4 segundos

    return () => clearInterval(interval);
  }, [isStreaming, buildId, environment]);

  // Filtrar logs
  useEffect(() => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.source.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (levelFilter !== 'all') {
      filtered = filtered.filter(log => log.level === levelFilter);
    }

    if (sourceFilter !== 'all') {
      filtered = filtered.filter(log => log.source === sourceFilter);
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, levelFilter, sourceFilter]);

  // Auto scroll
  useEffect(() => {
    if (autoScroll && scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0;
    }
  }, [filteredLogs, autoScroll]);

  const getLogIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'error':
        return <XCircle className="h-3 w-3 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-3 w-3 text-yellow-500" />;
      case 'success':
        return <CheckCircle2 className="h-3 w-3 text-green-500" />;
      case 'debug':
        return <Info className="h-3 w-3 text-purple-500" />;
      default:
        return <Clock className="h-3 w-3 text-blue-500" />;
    }
  };

  const getLogColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'debug':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const exportLogs = () => {
    const logData = filteredLogs.map(log => ({
      timestamp: log.timestamp.toISOString(),
      level: log.level,
      source: log.source,
      message: log.message,
      environment: log.environment,
      buildId: log.buildId,
      duration: log.duration,
      metadata: log.metadata
    }));

    const blob = new Blob([JSON.stringify(logData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deployment-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  const uniqueSources = Array.from(new Set(logs.map(log => log.source)));

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Logs de Deployment
              {buildId && (
                <Badge variant="outline">Build #{buildId}</Badge>
              )}
            </CardTitle>
            <CardDescription>
              {isStreaming ? (
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Streaming en vivo • {filteredLogs.length} entradas
                </span>
              ) : (
                `${filteredLogs.length} entradas • Pausado`
              )}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsStreaming(!isStreaming)}
            >
              {isStreaming ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Reanudar
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={clearLogs}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpiar
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={exportLogs}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-4 pt-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar en logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Nivel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="debug">Debug</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Fuente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {uniqueSources.map(source => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea 
          ref={scrollAreaRef}
          className="h-96 px-6 pb-6"
        >
          <div className="space-y-1 font-mono text-sm">
            {filteredLogs.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                {logs.length === 0 ? (
                  'No hay logs disponibles...'
                ) : (
                  'No se encontraron logs que coincidan con los filtros'
                )}
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div 
                  key={log.id} 
                  className={`flex items-start gap-3 p-2 rounded text-xs border-l-2 ${getLogColor(log.level)}`}
                >
                  <div className="flex items-center gap-2 min-w-20 text-gray-500">
                    <span className="font-mono">
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 min-w-16">
                    {getLogIcon(log.level)}
                    <Badge 
                      variant="outline" 
                      className={`text-xs px-1 py-0 ${log.level === 'error' ? 'border-red-300' : ''}`}
                    >
                      {log.level.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 min-w-20">
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      {log.source}
                    </Badge>
                  </div>
                  
                  <div className="flex-1">
                    <span>{log.message}</span>
                    
                    {log.duration && (
                      <span className="ml-2 text-gray-500">
                        ({formatDuration(log.duration)})
                      </span>
                    )}
                    
                    {log.metadata && (
                      <div className="mt-1 text-gray-500">
                        {Object.entries(log.metadata).map(([key, value]) => (
                          <span key={key} className="mr-3">
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-gray-400 min-w-20 text-right">
                    <Badge variant="outline" className="text-xs">
                      {log.environment}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
