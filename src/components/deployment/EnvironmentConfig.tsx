import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Globe, 
  Monitor, 
  Server, 
  Key, 
  GitBranch,
  Settings,
  AlertTriangle,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  ExternalLink
} from 'lucide-react';

interface EnvironmentVariable {
  id: string;
  key: string;
  value: string;
  isSecret: boolean;
  description?: string;
}

interface Environment {
  id: string;
  name: string;
  type: 'development' | 'staging' | 'production';
  url: string;
  branch: string;
  autoDeployEnabled: boolean;
  buildCommand: string;
  outputDirectory: string;
  variables: EnvironmentVariable[];
  lastDeploy?: Date;
  status: 'active' | 'inactive' | 'error';
}

export default function EnvironmentConfig() {
  const [environments, setEnvironments] = useState<Environment[]>([
    {
      id: 'prod',
      name: 'Production',
      type: 'production',
      url: 'https://la-economica.netlify.app',
      branch: 'main',
      autoDeployEnabled: true,
      buildCommand: 'npm run build',
      outputDirectory: 'dist',
      lastDeploy: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'active',
      variables: [
        {
          id: '1',
          key: 'VITE_API_URL',
          value: 'https://api.la-economica.com',
          isSecret: false,
          description: 'URL base de la API de producción'
        },
        {
          id: '2',
          key: 'VITE_STRIPE_PUBLISHABLE_KEY',
          value: 'pk_live_*****',
          isSecret: true,
          description: 'Clave pública de Stripe para producción'
        },
        {
          id: '3',
          key: 'VITE_SENTRY_DSN',
          value: 'https://****@sentry.io/****',
          isSecret: true,
          description: 'DSN de Sentry para monitoreo de errores'
        }
      ]
    },
    {
      id: 'staging',
      name: 'Staging',
      type: 'staging',
      url: 'https://staging--la-economica.netlify.app',
      branch: 'develop',
      autoDeployEnabled: true,
      buildCommand: 'npm run build',
      outputDirectory: 'dist',
      lastDeploy: new Date(Date.now() - 30 * 60 * 1000),
      status: 'active',
      variables: [
        {
          id: '4',
          key: 'VITE_API_URL',
          value: 'https://api-staging.la-economica.com',
          isSecret: false,
          description: 'URL base de la API de staging'
        },
        {
          id: '5',
          key: 'VITE_STRIPE_PUBLISHABLE_KEY',
          value: 'pk_test_*****',
          isSecret: true,
          description: 'Clave pública de Stripe para testing'
        }
      ]
    },
    {
      id: 'dev',
      name: 'Development',
      type: 'development',
      url: 'https://dev--la-economica.netlify.app',
      branch: 'feature/*',
      autoDeployEnabled: false,
      buildCommand: 'npm run build',
      outputDirectory: 'dist',
      lastDeploy: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: 'active',
      variables: [
        {
          id: '6',
          key: 'VITE_API_URL',
          value: 'http://localhost:5000',
          isSecret: false,
          description: 'URL local del servidor de desarrollo'
        }
      ]
    }
  ]);

  const [selectedEnv, setSelectedEnv] = useState<Environment>(environments[0]);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [newVariable, setNewVariable] = useState<Partial<EnvironmentVariable>>({});

  const getEnvironmentIcon = (type: Environment['type']) => {
    switch (type) {
      case 'production':
        return <Globe className="h-4 w-4 text-green-600" />;
      case 'staging':
        return <Monitor className="h-4 w-4 text-yellow-600" />;
      case 'development':
        return <Server className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusBadge = (status: Environment['status']) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      error: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const toggleSecretVisibility = (variableId: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [variableId]: !prev[variableId]
    }));
  };

  const addVariable = () => {
    if (!newVariable.key || !newVariable.value) return;

    const variable: EnvironmentVariable = {
      id: Date.now().toString(),
      key: newVariable.key,
      value: newVariable.value,
      isSecret: newVariable.isSecret || false,
      description: newVariable.description
    };

    setEnvironments(envs =>
      envs.map(env =>
        env.id === selectedEnv.id
          ? { ...env, variables: [...env.variables, variable] }
          : env
      )
    );

    setSelectedEnv(prev => ({
      ...prev,
      variables: [...prev.variables, variable]
    }));

    setNewVariable({});
  };

  const removeVariable = (variableId: string) => {
    setEnvironments(envs =>
      envs.map(env =>
        env.id === selectedEnv.id
          ? { ...env, variables: env.variables.filter(v => v.id !== variableId) }
          : env
      )
    );

    setSelectedEnv(prev => ({
      ...prev,
      variables: prev.variables.filter(v => v.id !== variableId)
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const updateEnvironmentSetting = (key: keyof Environment, value: any) => {
    const updatedEnv = { ...selectedEnv, [key]: value };
    setSelectedEnv(updatedEnv);
    
    setEnvironments(envs =>
      envs.map(env => env.id === selectedEnv.id ? updatedEnv : env)
    );
  };

  return (
    <div className="space-y-6">
      {/* Selector de ambientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuración de Ambientes
          </CardTitle>
          <CardDescription>
            Gestiona la configuración de tus ambientes de deployment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {environments.map((env) => (
              <Card
                key={env.id}
                className={`cursor-pointer transition-all ${
                  selectedEnv.id === env.id
                    ? 'ring-2 ring-brand-500 bg-brand-50'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedEnv(env)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getEnvironmentIcon(env.type)}
                      <span className="font-medium">{env.name}</span>
                    </div>
                    {getStatusBadge(env.status)}
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Branch: {env.branch}</div>
                    <div className="flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      <span className="truncate">{env.url}</span>
                    </div>
                    {env.lastDeploy && (
                      <div>
                        Último deploy: {env.lastDeploy.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuración del ambiente seleccionado */}
      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings">Configuración General</TabsTrigger>
          <TabsTrigger value="variables">Variables de Entorno</TabsTrigger>
          <TabsTrigger value="deploy">Deploy Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getEnvironmentIcon(selectedEnv.type)}
                {selectedEnv.name}
              </CardTitle>
              <CardDescription>
                Configuración general del ambiente {selectedEnv.name.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="env-name">Nombre del Ambiente</Label>
                  <Input
                    id="env-name"
                    value={selectedEnv.name}
                    onChange={(e) => updateEnvironmentSetting('name', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="env-url">URL de Deploy</Label>
                  <Input
                    id="env-url"
                    value={selectedEnv.url}
                    onChange={(e) => updateEnvironmentSetting('url', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="env-branch">Branch</Label>
                  <Input
                    id="env-branch"
                    value={selectedEnv.branch}
                    onChange={(e) => updateEnvironmentSetting('branch', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="build-command">Comando de Build</Label>
                  <Input
                    id="build-command"
                    value={selectedEnv.buildCommand}
                    onChange={(e) => updateEnvironmentSetting('buildCommand', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="output-dir">Directorio de Salida</Label>
                  <Input
                    id="output-dir"
                    value={selectedEnv.outputDirectory}
                    onChange={(e) => updateEnvironmentSetting('outputDirectory', e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-deploy"
                    checked={selectedEnv.autoDeployEnabled}
                    onCheckedChange={(checked) => updateEnvironmentSetting('autoDeployEnabled', checked)}
                  />
                  <Label htmlFor="auto-deploy">Auto-deploy habilitado</Label>
                </div>
              </div>

              {selectedEnv.type === 'production' && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Ten cuidado al modificar la configuración de producción. 
                    Los cambios pueden afectar el sitio en vivo.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variables" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Variables de Entorno - {selectedEnv.name}
              </CardTitle>
              <CardDescription>
                Gestiona las variables de entorno para este ambiente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Variables existentes */}
              <div className="space-y-4">
                {selectedEnv.variables.map((variable) => (
                  <div key={variable.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-medium">{variable.key}</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {variable.isSecret && !showSecrets[variable.id]
                              ? '••••••••••••'
                              : variable.value
                            }
                          </code>
                          {variable.isSecret && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleSecretVisibility(variable.id)}
                            >
                              {showSecrets[variable.id] ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(variable.value)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm text-gray-500">Tipo</Label>
                        <div className="mt-1">
                          <Badge variant={variable.isSecret ? 'destructive' : 'secondary'}>
                            {variable.isSecret ? 'Secret' : 'Public'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm text-gray-500">Descripción</Label>
                        <div className="text-sm text-gray-600 mt-1">
                          {variable.description || 'Sin descripción'}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVariable(variable.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Agregar nueva variable */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Agregar Nueva Variable</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-key">Clave</Label>
                      <Input
                        id="new-key"
                        placeholder="VITE_API_URL"
                        value={newVariable.key || ''}
                        onChange={(e) => setNewVariable(prev => ({ ...prev, key: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-value">Valor</Label>
                      <Input
                        id="new-value"
                        placeholder="https://api.example.com"
                        value={newVariable.value || ''}
                        onChange={(e) => setNewVariable(prev => ({ ...prev, value: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-description">Descripción (opcional)</Label>
                    <Textarea
                      id="new-description"
                      placeholder="Descripción de la variable..."
                      value={newVariable.description || ''}
                      onChange={(e) => setNewVariable(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="new-secret"
                      checked={newVariable.isSecret || false}
                      onCheckedChange={(checked) => setNewVariable(prev => ({ ...prev, isSecret: checked }))}
                    />
                    <Label htmlFor="new-secret">Variable secreta</Label>
                  </div>

                  <Button onClick={addVariable} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Variable
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deploy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Configuración de Deploy
              </CardTitle>
              <CardDescription>
                Configuración avanzada de deployment para {selectedEnv.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <GitBranch className="h-4 w-4" />
                <AlertDescription>
                  La configuración avanzada de deploy se implementará en la siguiente fase.
                  Incluirá webhooks, triggers personalizados y políticas de rollback.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
