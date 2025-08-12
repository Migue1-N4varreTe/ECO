#!/bin/bash

# 🚀 Script de Setup para Deployment de La Económica
# Configura automáticamente backend y frontend para deployment separado

set -e  # Salir si hay errores

echo "🚀 Configurando deployment para La Económica..."
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar dependencias
check_dependencies() {
    log "Verificando dependencias..."
    
    if ! command -v node &> /dev/null; then
        error "Node.js no está instalado"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        error "npm no está instalado"
        exit 1
    fi
    
    log "✅ Node.js $(node --version) y npm $(npm --version) detectados"
}

# Instalar dependencias
install_dependencies() {
    log "Instalando dependencias del proyecto..."
    npm ci
    
    log "Instalando dependencias del backend..."
    cd backend && npm ci && cd ..
    
    log "✅ Dependencias instaladas"
}

# Configurar variables de entorno
setup_environment() {
    log "Configurando variables de entorno..."
    
    # Frontend .env
    if [ ! -f .env ]; then
        log "Creando .env para frontend..."
        cat > .env << EOF
# Frontend Environment Variables
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id
EOF
        warn "⚠️  Actualiza las variables en .env con tus valores reales"
    else
        log "✅ .env ya existe"
    fi
    
    # Backend .env
    if [ ! -f backend/.env ]; then
        log "Creando .env para backend..."
        cat > backend/.env << EOF
# Backend Environment Variables
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:8080

# Database
DATABASE_URL=mongodb://localhost:27017/la-economica

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this

# Stripe
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Sentry
SENTRY_DSN=https://your-dsn@sentry.io/project-id
EOF
        warn "⚠️  Actualiza las variables en backend/.env con tus valores reales"
    else
        log "✅ backend/.env ya existe"
    fi
}

# Configurar Railway
setup_railway() {
    log "Configurando Railway..."
    
    if ! command -v railway &> /dev/null; then
        warn "Railway CLI no está instalado. Instalando..."
        npm install -g @railway/cli
    fi
    
    log "✅ Railway CLI configurado"
    echo ""
    echo -e "${BLUE}Para conectar con Railway:${NC}"
    echo "1. railway login"
    echo "2. railway link (en el directorio backend/)"
    echo "3. railway deploy"
}

# Configurar Netlify
setup_netlify() {
    log "Configurando Netlify..."
    
    if ! command -v netlify &> /dev/null; then
        warn "Netlify CLI no está instalado. Instalando..."
        npm install -g netlify-cli
    fi
    
    log "✅ Netlify CLI configurado"
    echo ""
    echo -e "${BLUE}Para conectar con Netlify:${NC}"
    echo "1. netlify login"
    echo "2. netlify init"
    echo "3. netlify deploy --prod"
}

# Verificar configuración
verify_setup() {
    log "Verificando configuración..."
    
    # Test TypeScript
    if npm run typecheck; then
        log "✅ TypeScript OK"
    else
        error "❌ Errores de TypeScript"
    fi
    
    # Test build
    if npm run build; then
        log "✅ Build frontend OK"
    else
        error "❌ Error en build frontend"
    fi
    
    # Test backend basic
    if [ -f "backend/server.js" ]; then
        log "✅ Backend server encontrado"
    else
        error "❌ Backend server no encontrado"
    fi
}

# Mostrar información final
show_deployment_info() {
    echo ""
    echo -e "${GREEN}🎉 Setup de deployment completado!${NC}"
    echo ""
    echo -e "${BLUE}📋 Próximos pasos:${NC}"
    echo ""
    echo "🔧 Backend (Railway):"
    echo "  1. cd backend"
    echo "  2. railway login"
    echo "  3. railway link"
    echo "  4. railway deploy"
    echo ""
    echo "🎨 Frontend (Netlify):"
    echo "  1. netlify login"
    echo "  2. netlify init"
    echo "  3. npm run build"
    echo "  4. netlify deploy --prod"
    echo ""
    echo "🚀 Deployment simultáneo:"
    echo "  npm run deploy:all"
    echo ""
    echo "📊 Monitoreo:"
    echo "  Backend Health: http://localhost:5000/api/health"
    echo "  Frontend: http://localhost:8080"
    echo ""
    echo -e "${YELLOW}⚠️  Recuerda actualizar las variables de entorno en .env y backend/.env${NC}"
}

# Función principal
main() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                   LA ECONÓMICA DEPLOYMENT                   ║"
    echo "║              Setup de Arquitectura Separada                 ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    
    check_dependencies
    install_dependencies
    setup_environment
    setup_railway
    setup_netlify
    verify_setup
    show_deployment_info
}

# Ejecutar si es llamado directamente
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
