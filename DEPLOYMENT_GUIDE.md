# 🚀 Guía de Deployment - Arquitectura Separada

## Estrategias de Deployment Recomendadas

### 1. **Frontend (Netlify) + Backend (Railway/Render)**
✅ **Opción Recomendada - Máxima Flexibilidad**

```bash
# Frontend → Netlify (ya configurado)
# Backend → Railway/Render/Fly.io

# Configuración:
Frontend:  https://la-economica.netlify.app
Backend:   https://api.la-economica.railway.app
```

**Ventajas:**
- Deployment independiente de cada servicio
- Escalabilidad individual
- Especialización de plataformas
- Zero downtime deployments

### 2. **Ambos en Railway (Servicios Separados)**
✅ **Opción Simplificada - Una Plataforma**

```bash
# Proyecto único con 2 servicios
railway-project/
├── frontend-service/
└── backend-service/
```

### 3. **Docker Compose en Fly.io/Railway**
✅ **Opción Avanzada - Containerización**

```yaml
# docker-compose.yml
services:
  frontend:
    build: ./
    command: npm run build && npm run preview
    ports: ["8080:8080"]
  
  backend:
    build: ./backend
    command: npm start
    ports: ["5000:5000"]
```

## Implementación Paso a Paso

### **Opción 1: Netlify + Railway (Recomendada)**

#### 🎯 Backend en Railway

1. **Crear `railway.json` para el backend:**
```json
{
  "deploy": {
    "startCommand": "npm run start:backend",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

2. **Variables de entorno del backend:**
```bash
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://la-economica.netlify.app
DATABASE_URL=mongodb://...
JWT_SECRET=...
STRIPE_SECRET_KEY=...
```

3. **Deploy del backend:**
```bash
# Conectar repositorio a Railway
railway login
railway link
railway deploy
```

#### 🎯 Frontend en Netlify (actualizar)

1. **Actualizar variables de entorno:**
```bash
VITE_API_URL=https://api.la-economica.railway.app
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

2. **Build settings en Netlify:**
```toml
# netlify.toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "https://api.la-economica.railway.app/api/:splat"
  status = 200
  force = true
```

### **Opción 2: Todo en Railway (Servicios Separados)**

#### Estructura del proyecto:
```
la-economica/
├── frontend/          # Servicio React
│   ├── package.json
│   └── vite.config.ts
├── backend/           # Servicio Express
│   ├── package.json
│   └── server.js
└── railway.toml       # Configuración Railway
```

#### `railway.toml`:
```toml
[[services]]
name = "frontend"
source = "frontend"
variables = { NODE_ENV = "production" }

[[services]]
name = "backend"
source = "backend"
variables = { NODE_ENV = "production" }
```

### **Opción 3: Docker (Fly.io/Railway)**

#### `Dockerfile.frontend`:
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 8080
CMD ["npm", "run", "preview"]
```

#### `Dockerfile.backend`:
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/ .

EXPOSE 5000
CMD ["npm", "start"]
```

## Configuración de CORS

### Backend (`backend/middleware/security.js`):
```javascript
const cors = require('cors');

const corsOptions = {
  origin: [
    'http://localhost:8080',          // Desarrollo
    'https://la-economica.netlify.app', // Producción
    'https://staging--la-economica.netlify.app' // Staging
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = cors(corsOptions);
```

## Scripts de Deployment

### `package.json` (raíz):
```json
{
  "scripts": {
    "deploy:frontend": "netlify deploy --prod --dir=dist",
    "deploy:backend": "railway deploy",
    "deploy:all": "npm run deploy:backend && npm run deploy:frontend",
    "build:frontend": "vite build",
    "build:backend": "echo 'Backend build complete'",
    "build:all": "npm run build:frontend && npm run build:backend"
  }
}
```

## Monitoreo y Health Checks

### Backend Health Check:
```javascript
// backend/routes/health.js
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version
  });
});
```

### Frontend Environment Check:
```typescript
// src/lib/environment.ts
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  environment: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD
};
```

## Pipelines de CI/CD

### GitHub Actions (`.github/workflows/deploy.yml`):
```yaml
name: Deploy La Económica

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        uses: railway-project/deploy@v1
        with:
          token: ${{ secrets.RAILWAY_TOKEN }}
          service: backend

  deploy-frontend:
    runs-on: ubuntu-latest
    needs: deploy-backend
    steps:
      - uses: actions/checkout@v3
      - name: Build and Deploy to Netlify
        uses: netlify/actions/build@v1
        with:
          publish-dir: './dist'
          production-branch: main
```

## URLs de Ambiente

### Desarrollo:
- Frontend: `http://localhost:8080`
- Backend: `http://localhost:5000`

### Staging:
- Frontend: `https://staging--la-economica.netlify.app`
- Backend: `https://staging-api.la-economica.railway.app`

### Producción:
- Frontend: `https://la-economica.netlify.app`
- Backend: `https://api.la-economica.railway.app`

## Beneficios de la Arquitectura Separada

✅ **Escalabilidad Individual**
- Frontend y backend escalan independientemente
- Optimización específica por servicio

✅ **Deployment Independiente**
- Deploy de frontend sin afectar backend
- Rollbacks independientes

✅ **Tecnología Especializada**
- CDN optimizado para frontend (Netlify)
- Servidor optimizado para APIs (Railway)

✅ **Costos Optimizados**
- Pago por uso específico de cada servicio
- Sin recursos subutilizados

✅ **Desarrollo Paralelo**
- Equipos pueden trabajar independientemente
- Releases más frecuentes

## Próximos Pasos

1. **Elegir estrategia de deployment**
2. **Configurar variables de entorno**
3. **Actualizar configuración de CORS**
4. **Implementar health checks**
5. **Configurar monitoreo**
6. **Establecer pipeline de CI/CD**

¿Con cuál estrategia te gustaría empezar?
