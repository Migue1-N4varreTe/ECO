📘 README.md
# La Económica - Fullstack E-commerce Platform

Sistema completo para gestionar una tienda digital tipo convenience store con **arquitectura separada** entre frontend y backend.

## 🏗️ Arquitectura

- **Frontend**: React 18 + TypeScript + Vite (Puerto 8080)
- **Backend**: Node.js + Express API (Puerto 5000)
- **Deployment**: Netlify (Frontend) + Railway (Backend)

### 🚀 Instalación rápida
```bash
# Clonar el repositorio
git clone https://github.com/Migue1-n4varrete/ECO.git
cd la-economica

# Setup automático
./scripts/setup-deployment.sh

# O manual:
npm ci
cd backend && npm ci && cd ..
```

### ▶️ Ejecutar en desarrollo
```bash
# Ambos servicios simultáneamente
npm run dev

# O por separado:
npm run dev:frontend  # Frontend (Puerto 8080)
npm run dev:backend   # Backend (Puerto 5000)
```

## 🚀 Deployment

### Opción 1: Netlify + Railway (Recomendada)
```bash
# Backend → Railway
cd backend
railway login
railway deploy

# Frontend → Netlify
npm run build
netlify deploy --prod

# O ambos simultáneamente
npm run deploy:all
```

### Opción 2: Docker Compose
```bash
# Build y deploy con Docker
docker-compose up --build -d

# Verificar servicios
docker-compose ps
```

### URLs de Producción
- **Frontend**: https://la-economica.netlify.app
- **Backend**: https://api.la-economica.railway.app
- **Health Check**: https://api.la-economica.railway.app/api/health

### 📦 Tecnologías principales
- **Frontend:** React + Vite + TailwindCSS
- **Backend:** Node.js + Express + MongoDB
- **Auth:** JWT + bcryptjs
- **UI Extra:** React Router, Context API
- **Test:** Jest + Supertest
- **Deploy:** Netlify + Railway + GitHub Actions

### 📁 Estructura Modular
Separación por dominios funcionales: `auth`, `products`, `sales`, `clients`, `employees`, `reports`.

### 🗺️ Rutas clave (ejemplo)
- `POST /auth/login`
- `GET /products`
- `POST /sales/checkout`
- `GET /reports/sales`

---

### 🧪 Pruebas y calidad (pendientes)
- Unit tests y middleware validation
- Seguridad con express-validator
- Logs con Winston/Morgan

### 🧑‍💻 Autor
Ricitos / LearnLab Studio

> Prototipo abierto al escalado: roles, POS, notificaciones, pagos, apps móviles y más.
