# 🚀 Guía de Deployment (Netlify + Railway)

Esta guía deja listo el despliegue simultáneo: frontend en Netlify y backend en Railway. El proyecto ya está preparado (netlify.toml, railway.toml, CORS y healthcheck).

---
## 1) Backend en Railway (Express API)

1. Crear servicio en Railway apuntando al repo (directorio backend ya es la raíz del servicio).
2. Variables de entorno (Backend):
   - NODE_ENV=production
   - PORT=5000
   - SUPABASE_URL=SU_URL_SUPABASE (p.ej. https://evyslzzekjrskeyparqn.supabase.co)
   - SUPABASE_ANON_KEY=TU_ANON_KEY_PUBLICA
   - SUPABASE_SERVICE_KEY=TU_SERVICE_ROLE_KEY (requerida si usarás operaciones admin)
   - JWT_SECRET=TU_SECRETO_JWT
   - STRIPE_SECRET_KEY=sk_live_... (opcional; si no se define, pagos quedan deshabilitados)
   - SENTRY_DSN=... (opcional)
3. Deploy (desde el UI de Railway). La API responde en: https://<tu-servicio>.railway.app
4. Verifica healthcheck: GET https://<tu-servicio>.railway.app/api/health

Notas:
- Si faltan claves de Supabase, el backend arranca en modo "sin Supabase".
- CORS permite *.netlify.app y localhost.

---
## 2) Frontend en Netlify (Vite React)

1. Crear sitio en Netlify desde el mismo repo.
2. Build settings:
   - Build command: npm run build
   - Publish directory: dist
3. Variables de entorno (Frontend):
   - VITE_API_URL=https://<tu-servicio>.railway.app
   - VITE_SUPABASE_URL=SU_URL_SUPABASE (p.ej. https://evyslzzekjrskeyparqn.supabase.co)
   - VITE_SUPABASE_ANON_KEY=TU_ANON_KEY_PUBLICA
   - VITE_STRIPE_PUBLISHABLE_KEY=pk_live_... (opcional)
   - VITE_SENTRY_DSN=... (opcional)
4. Deploy. Netlify servirá el SPA y redirigirá todo a /index.html (netlify.toml ya lo define).

---
## 3) Verificación rápida

- Frontend: https://<tu-sitio>.netlify.app carga y muestra "Todo lo que necesitas".
- Navegación a /gramaje, /tickets y /celebracion no debe dar 404.
- Llamadas a la API usan VITE_API_URL. Prueba /api/health desde el navegador.

---
## 4) Troubleshooting

- 401/403 CORS: confirma dominio de Netlify y que CORS acepte *.netlify.app (ya soportado).
- 500 en backend: revisa logs Railway; define JWT_SECRET y claves Supabase/Stripe si corresponde.
- Pagos: requieren STRIPE_SECRET_KEY (backend) y VITE_STRIPE_PUBLISHABLE_KEY (frontend).

---
## 5) Scripts útiles

- npm run build        # build frontend
- npm run deploy:backend  # (Railway CLI) si lo usas
- npm run deploy:frontend # (Netlify CLI) si lo usas

---
## 6) Seguridad

Nunca subas claves al repo. Define variables sólo en los paneles de Netlify/Railway.

---
## 7) Referencias

- netlify.toml: build, headers y SPA redirects
- railway.toml: startCommand y healthcheck
- backend/config/cors.js: CORS con soporte *.netlify.app
- src/config/environment.ts: lectura de VITE_API_URL
