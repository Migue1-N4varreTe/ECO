import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Settings, 
  GitBranch, 
  Play, 
  Pause, 
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Server,
  Globe,
  Monitor,
  Database,
  Zap
} from 'lucide-react';

interface DeploymentStatus {
  id: string;
  environment: 'development' | 'staging' | 'production';
  status: 'building' | 'deployed' | 'failed' | 'pending';
  branch: string;
  commit: string;
  timestamp: Date;
  duration?: number;
  url?: string;
}

interface BuildMetrics {
  totalBuilds: number;
  successRate: number;
  averageBuildTime: number;
  lastWeekBuilds: number;
}

export default function Deployment() {
  const [deployments, setDeployments] = useState<DeploymentStatus[]>([
    {
      id: '1',
      environment: 'production',
      status: 'deployed',
      branch: 'main',
      commit: 'fix: optimize product search performance',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      duration: 180,
      url: 'https://la-economica.netlify.app'
    },
    {
      id: '2',
      environment: 'staging',
      status: 'building',
      branch: 'develop',
      commit: 'feat: add deployment dashboard UI',
      timestamp: new Date(),
      url: 'https://staging--la-economica.netlify.app'
    },
    {
      id: '3',
      environment: 'development',
      status: 'deployed',
      branch: 'feature/deployment-gui',
      commit: 'wip: deployment dashboard components',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      duration: 95,
      url: 'https://dev--la-economica.netlify.app'
    }
  ]);

  const [metrics, setMetrics] = useState<BuildMetrics>({
    totalBuilds: 127,
    successRate: 94.5,
    averageBuildTime: 142,
    lastWeekBuilds: 23
  });

  const [buildProgress, setBuildProgress] = useState(0);

  useEffect(() => {
    // Simular progreso de build en tiempo real
    const buildingDeployment = deployments.find(d => d.status === 'building');
    if (buildingDeployment) {
      const interval = setInterval(() => {
        setBuildProgress(prev => {
          if (prev >= 100) {
            // Actualizar el deployment como completado
            setDeployments(deps => 
              deps.map(d => 
                d.id === buildingDeployment.id 
                  ? { ...d, status: 'deployed' as const, duration: 156 }
                  : d
              )
            );
            return 0;
          }
          return prev + Math.random() * 5;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [deployments]);

  const getStatusIcon = (status: DeploymentStatus['status']) => {
    switch (status) {
      case 'deployed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'building':
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: DeploymentStatus['status']) => {
    const variants = {
      deployed: 'bg-green-100 text-green-800',
      building: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getEnvironmentIcon = (env: DeploymentStatus['environment']) => {
    switch (env) {
      case 'production':
        return <Globe className="h-4 w-4" />;
      case 'staging':
        return <Monitor className="h-4 w-4" />;
      case 'development':
        return <Server className="h-4 w-4" />;
    }
  };

  const triggerDeploy = (environment: string) => {
    const newDeploy: DeploymentStatus = {
      id: Date.now().toString(),
      environment: environment as DeploymentStatus['environment'],
      status: 'building',
      branch: environment === 'production' ? 'main' : 'develop',
      commit: 'feat: trigger manual deployment',
      timestamp: new Date()
    };

    setDeployments([newDeploy, ...deployments]);
    setBuildProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🚀 Panel de Despliegue
          </h1>
          <p className="text-gray-600">
            Monitorea y gestiona los deployments de La Económica
          </p>
        </div>

        {/* Métricas generales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Builds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-600">
                {metrics.totalBuilds}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tasa de Éxito
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {metrics.successRate}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tiempo Promedio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {metrics.averageBuildTime}s
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Builds Esta Semana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {metrics.lastWeekBuilds}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="environments" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              Ambientes
            </TabsTrigger>
            <TabsTrigger value="builds" className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              Builds
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuración
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Status de deployments activos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-brand-500" />
                  Estado de Deployments
                </CardTitle>
                <CardDescription>
                  Monitoreo en tiempo real de los ambientes de La Económica
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {deployments.map((deployment) => (
                  <div key={deployment.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getEnvironmentIcon(deployment.environment)}
                        <span className="font-medium capitalize">
                          {deployment.environment}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getStatusIcon(deployment.status)}
                        {getStatusBadge(deployment.status)}
                      </div>

                      <div className="text-sm text-gray-600">
                        <div className="font-medium">{deployment.branch}</div>
                        <div className="truncate max-w-48">
                          {deployment.commit}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {deployment.status === 'building' && (
                        <div className="w-32">
                          <Progress value={buildProgress} className="h-2" />
                          <div className="text-xs text-gray-500 mt-1">
                            {Math.round(buildProgress)}%
                          </div>
                        </div>
                      )}
                      
                      {deployment.duration && (
                        <div className="text-sm text-gray-500">
                          {deployment.duration}s
                        </div>
                      )}
                      
                      <div className="text-sm text-gray-500">
                        {deployment.timestamp.toLocaleTimeString()}
                      </div>
                      
                      {deployment.url && deployment.status === 'deployed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(deployment.url, '_blank')}
                        >
                          Ver Sitio
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Actions rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
                <CardDescription>
                  Deploys manuales y tareas de mantenimiento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => triggerDeploy('production')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Deploy a Producción
                  </Button>
                  
                  <Button 
                    onClick={() => triggerDeploy('staging')}
                    variant="outline"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Deploy a Staging
                  </Button>
                  
                  <Button 
                    onClick={() => triggerDeploy('development')}
                    variant="outline"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Deploy a Development
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="environments">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Ambientes</CardTitle>
                <CardDescription>
                  Configuración y monitoreo de ambientes de deployment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <Database className="h-4 w-4" />
                  <AlertDescription>
                    Esta sección estará disponible en la siguiente fase de desarrollo.
                    Incluirá configuración de variables de entorno, webhooks y políticas de deployment.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="builds">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Builds</CardTitle>
                <CardDescription>
                  Registro completo de todos los deployments y builds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <GitBranch className="h-4 w-4" />
                  <AlertDescription>
                    El historial detallado de builds se implementará en la siguiente iteración.
                    Incluirá logs completos, métricas de performance y comparaciones entre builds.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Deployment</CardTitle>
                <CardDescription>
                  Configuración global del sistema de deployments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <Settings className="h-4 w-4" />
                  <AlertDescription>
                    Las configuraciones de deployment se implementarán próximamente.
                    Incluirá integración con Netlify, webhooks de GitHub y configuración de notificaciones.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
