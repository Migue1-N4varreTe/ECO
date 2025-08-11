# La Económica - Fullstack E-commerce Platform

La Económica es una plataforma moderna de e-commerce fullstack con **arquitectura separada** entre frontend y backend, diseñada para ser una tienda de conveniencia digital con entrega ultrarrápida.

## 🏗️ Arquitectura Separada

### Frontend (React SPA)
- **React 18** con TypeScript
- **React Router 6** para navegación SPA
- **Vite** como bundler y servidor de desarrollo
- **TailwindCSS 3** para styling
- **Vitest** para testing
- **PWA** instalable con Service Worker

### Backend (Node.js/Express - Separado)
- **Express.js** API REST independiente
- **Node.js** con middleware de seguridad
- **MongoDB** integration preparada
- **JWT** para autenticación
- **Stripe** para pagos
- **Supabase** para base de datos
- **Sentry** para monitoreo

### Comunicación Frontend ↔ Backend
```
Frontend (React SPA)     ←→     Backend API (Express)
Port: 8080 (Vite)               Port: 5000 (Express)
```

## 🛍️ Características para Clientes

✅ **Tienda Online Completa**
- Catálogo de productos con búsqueda avanzada
- Sistema de carrito de compras
- Wishlist y favoritos
- Checkout con Stripe integrado
- Autenticación de usuarios
- Historial de pedidos
- Sistema de ofertas y descuentos

✅ **Programa de Lealtad**
- Puntos por compras
- Recompensas y cupones
- Niveles de cliente
- Seguimiento de actividad

✅ **Experiencia Optimizada**
- PWA instalable como app nativa
- Funciona offline (cache básico)
- Tiempo de carga ≤ 3 segundos
- Responsive design completo
- Búsqueda inteligente con filtros

## 👨‍💼 Panel Administrativo

✅ **Dashboard de Administración**
- Analytics de ventas en tiempo real
- Gestión completa de inventario
- Sistema POS (Punto de Venta)
- Reportes y métricas
- Gestión de empleados
- Base de datos de clientes
- Configuración del sistema

✅ **Sistema de Permisos**
- Roles granulares (admin, empleado, cajero)
- Permisos por módulo
- Control de acceso seguro

## 🔧 Características Técnicas

### Frontend Stack
- **React 18** con hooks modernos
- **TypeScript** para type safety
- **React Router 6** para SPA routing
- **TailwindCSS 3** con design system personalizado
- **Radix UI** para componentes accesibles
- **Framer Motion** para animaciones
- **React Query** para state management de servidor

### Backend Stack (Separado)
- **Express.js** con middleware de seguridad
- **Node.js** con ES modules
- **JWT** para autenticación
- **bcryptjs** para hashing de passwords
- **Helmet** para security headers
- **CORS** configurado
- **Rate limiting** y protección DDoS
- **Input validation** con Joi

### Integraciones Externas
- **Supabase**: Base de datos y auth
- **Stripe**: Procesamiento de pagos
- **Sentry**: Monitoreo de errores
- **WebSockets**: Actualizaciones en tiempo real

### Performance & Optimización
- **Service Worker** agresivo con cache estratificado
- **Lazy loading** de imágenes y componentes
- **Virtualización** para listas largas de productos
- **Prefetch inteligente** basado en navegación
- **Code splitting** automático
- **PWA** completa con manifest.json

## 🌐 Arquitectura de Deployment

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Backend API     │    │  Servicios      │
│   React SPA     │───▶│  Express Server  │───▶│  Externos       │
│   (Netlify)     │    │  (Node.js)       │    │  (Supabase,     │
│   Port: 8080    │    │  Port: 5000      │    │   Stripe)       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📁 Estructura del Proyecto

### Frontend Structure
```
src/
├── components/     # Componentes reutilizables
│   ├── ui/         # UI library (Radix + Tailwind)
│   ├── pos/        # Componentes del sistema POS
│   ├── clients/    # Gestión de clientes
│   ├── inventory/  # Gestión de inventario
│   └── reports/    # Reportes y analytics
├── pages/          # Páginas de la aplicación
├── contexts/       # React contexts (Auth, Cart, etc.)
├── hooks/          # Custom hooks
├── services/       # API calls y servicios
└── lib/            # Utilidades y helpers
```

### Backend Structure (Separado)
```
backend/
├── auth/           # Autenticación y middleware
├── products/       # Gestión de productos
├── sales/          # Sistema de ventas
├── clients/        # Gestión de clientes
├── employees/      # Gestión de empleados
├── payments/       # Integración con Stripe
├── reports/        # Reportes y analytics
├── middleware/     # Security y validaciones
└── server.js       # Servidor principal
```

## 🛡️ Seguridad

### Frontend Security
- **CSP** (Content Security Policy)
- **XSS** protection en componentes
- **Input sanitization** en formularios
- **JWT** token management seguro

### Backend Security
- **Helmet** para security headers
- **CORS** configurado correctamente
- **Rate limiting** anti-DDoS
- **Input validation** con Joi
- **SQL injection** protection
- **bcryptjs** para passwords
- **JWT** con refresh tokens

## 🚀 Performance Optimizations

### Objetivo: ⏱️ Tiempo de carga ≤ 3 segundos

✅ **Service Worker Agresivo**
- Cache estratificado con prioridades
- Cache First para imágenes
- Network First para APIs
- Background sync para requests fallidas

✅ **Sistema de Cache Inteligente**
- Cache en memoria (50MB max)
- Persistencia en localStorage
- TTL por tipo de contenido
- Limpieza automática

✅ **Optimización de Imágenes**
- Lazy loading con Intersection Observer
- Esqueletos de carga para reducir CLS
- Fallback SVG para errores
- Optimización automática de tamaño

✅ **Virtualización**
- Carga progresiva de productos
- Preload de páginas siguientes
- Lazy loading basado en scroll

## 📱 PWA Features

✅ **Instalable como App Nativa**
- Manifest.json optimizado
- Service Worker completo
- Funciona offline
- Push notifications

✅ **Responsive Design**
- Mobile-first approach
- Breakpoints optimizados
- Touch-friendly interfaces

## 🧪 Testing

### Frontend Testing
- **Vitest** para unit tests
- **React Testing Library** para component tests
- **Playwright** para E2E testing

### Backend Testing
- **Jest** para unit tests de API
- **Supertest** para integration tests
- **Postman collections** para API testing

## 🔄 Development Workflow

### Frontend Development
```bash
npm run dev:frontend  # Vite dev server (port 8080)
npm run build         # Production build
npm run test          # Run Vitest tests
npm run typecheck     # TypeScript validation
```

### Backend Development
```bash
npm run dev:backend   # Nodemon server (port 5000)
npm run start:backend # Production server
```

### Full Development
```bash
npm run dev          # Concurrently run frontend + backend
```

## 🌟 Routing System

El sistema de routing está basado en React Router 6 en modo SPA:

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";

<Routes>
  <Route path="/" element={<Index />} />
  <Route path="/shop" element={<Shop />} />
  <Route path="/cart" element={<Cart />} />
  <Route path="/admin" element={<Admin />} />
  {/* ADD CUSTOM ROUTES ABOVE THE CATCH-ALL */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

### Principales Rutas
- `/` - Página principal
- `/shop` - Tienda de productos
- `/cart` - Carrito de compras
- `/checkout` - Proceso de pago
- `/admin` - Panel administrativo
- `/pos` - Sistema punto de venta
- `/employees` - Gestión de empleados
- `/reports` - Reportes y analytics

## 🎨 Styling System

### TailwindCSS 3 + Design System
- **Palette personalizada** para La Económica (naranjas, rojos, amarillos)
- **Componentes UI** basados en Radix UI
- **Class Variance Authority** para variants
- **Dark mode** support con CSS variables
- **Responsive design** mobile-first

### Color Palette
```css
/* Colores principales de La Económica */
brand: naranja principal (#f97316)
red: ofertas y descuentos (#ef4444)
yellow: promociones (#facc15)
fresh: productos frescos (#22c55e)
```

## 📊 State Management

### Frontend State
- **React Context** para auth y cart
- **React Query** para server state
- **Local Storage** para persistencia
- **WebSocket Context** para real-time updates

### Backend State
- **Express middleware** para request handling
- **JWT tokens** para session management
- **Database connections** con connection pooling

## 🔌 API Integration

### Frontend ↔ Backend Communication
```typescript
// Frontend service layer
const api = {
  products: {
    getAll: () => fetch('/api/products'),
    getById: (id) => fetch(`/api/products/${id}`),
    create: (product) => fetch('/api/products', { method: 'POST', ... })
  },
  auth: {
    login: (credentials) => fetch('/api/auth/login', { ... }),
    register: (userData) => fetch('/api/auth/register', { ... })
  }
}
```

### API Endpoints (Backend)
```
GET    /api/products       # Lista de productos
POST   /api/products       # Crear producto
GET    /api/auth/login     # Autenticación
POST   /api/sales          # Crear venta
GET    /api/reports        # Reportes
```

## 🎯 Resultado Final

**✅ ARQUITECTURA SEPARADA EXITOSA**

- **Frontend independiente** en React SPA
- **Backend independiente** en Express API
- **Comunicación clara** vía REST API
- **Deploy separado** para escalabilidad
- **Tiempo de carga ≤ 3 segundos**
- **683+ productos** con performance óptima
- **PWA completa** instalable
- **Sistema completo** de e-commerce

La aplicación mantiene una separación completa entre frontend y backend, permitiendo desarrollo, testing y deployment independientes mientras mantiene todas las funcionalidades de un e-commerce moderno.
