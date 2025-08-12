# 🔐 Configuración de GitHub Secrets

Guía paso a paso para configurar los secrets necesarios para el deployment automático de La Económica.

## 📋 Secrets Necesarios

### **Obligatorios para Production:**
- `RAILWAY_TOKEN` - Token de Railway para deploy del backend
- `NETLIFY_AUTH_TOKEN` - Token de Netlify para deploy del frontend
- `NETLIFY_SITE_ID` - ID del sitio de Netlify
- `STRIPE_PUBLISHABLE_KEY` - Clave pública de Stripe (producción)

### **Opcionales:**
- `SENTRY_DSN` - Para monitoreo de errores
- `STRIPE_TEST_PUBLISHABLE_KEY` - Para ambiente de staging

---

## 🚀 **1. Acceder a GitHub Secrets**

1. Ve a tu repositorio: https://github.com/Migue1-N4varreTe/ECO
2. Click en **"Settings"** (pestaña superior)
3. En el menú lateral izquierdo: **"Secrets and variables"** → **"Actions"**
4. Click **"New repository secret"**

---

## 🚆 **2. RAILWAY_TOKEN**

### Obtener el token:
1. Ve a https://railway.app
2. Login en tu cuenta
3. Ve a **Account Settings** (click en tu avatar)
4. Click en **"Tokens"** en el menú lateral
5. **"Create New Token"**
6. Nombre: `la-economica-deploy`
7. Copia el token generado

### Configurar en GitHub:
- **Name**: `RAILWAY_TOKEN`
- **Secret**: Pega el token de Railway
- Click **"Add secret"**

---

## 🌐 **3. NETLIFY_AUTH_TOKEN**

### Obtener el token:
1. Ve a https://app.netlify.com
2. Login en tu cuenta
3. Click en tu avatar → **"User settings"**
4. **"Applications"** en el menú lateral
5. Scroll hasta **"Personal access tokens"**
6. **"New access token"**
7. Descripción: `la-economica-github-actions`
8. Copia el token generado

### Configurar en GitHub:
- **Name**: `NETLIFY_AUTH_TOKEN`
- **Secret**: Pega el token de Netlify
- Click **"Add secret"**

---

## 🆔 **4. NETLIFY_SITE_ID**

### Obtener el Site ID:

#### Opción A - Desde Dashboard:
1. Ve a https://app.netlify.com
2. Click en tu sitio de La Económica
3. **"Site settings"**
4. En **"General"** → **"Site information"**
5. Copia el **"Site ID"** (algo como: `abc123-def456-ghi789`)

#### Opción B - Desde CLI (si ya tienes el proyecto):
```bash
netlify status
# Busca "Site Id: xxxxxxx"
```

### Configurar en GitHub:
- **Name**: `NETLIFY_SITE_ID`
- **Secret**: Pega el Site ID
- Click **"Add secret"**

---

## 💳 **5. STRIPE_PUBLISHABLE_KEY**

### Obtener la clave:
1. Ve a https://dashboard.stripe.com
2. Login en tu cuenta
3. **"Developers"** → **"API keys"**
4. Copia la **"Publishable key"** (empieza con `pk_live_...`)

### Configurar en GitHub:
- **Name**: `STRIPE_PUBLISHABLE_KEY`
- **Secret**: Pega la clave pública de Stripe
- Click **"Add secret"**

---

## 🐛 **6. SENTRY_DSN** (Opcional)

### Obtener el DSN:
1. Ve a https://sentry.io
2. Login en tu cuenta
3. Ve a tu proyecto de La Económica
4. **"Settings"** → **"Client Keys (DSN)"**
5. Copia el **"DSN"** (algo como: `https://abc123@o456789.ingest.sentry.io/789123`)

### Configurar en GitHub:
- **Name**: `SENTRY_DSN`
- **Secret**: Pega el DSN de Sentry
- Click **"Add secret"**

---

## 🧪 **7. STRIPE_TEST_PUBLISHABLE_KEY** (Para Staging)

### Obtener la clave de test:
1. En Stripe Dashboard, asegúrate de estar en **"Test mode"** (toggle arriba)
2. **"Developers"** → **"API keys"**
3. Copia la **"Publishable key"** de test (empieza con `pk_test_...`)

### Configurar en GitHub:
- **Name**: `STRIPE_TEST_PUBLISHABLE_KEY`
- **Secret**: Pega la clave de test de Stripe
- Click **"Add secret"**

---

## ✅ **Verificación Final**

### Lista de secrets configurados:
Tu repositorio debe tener estos secrets:
```
✅ RAILWAY_TOKEN
✅ NETLIFY_AUTH_TOKEN  
✅ NETLIFY_SITE_ID
✅ STRIPE_PUBLISHABLE_KEY
✅ SENTRY_DSN (opcional)
✅ STRIPE_TEST_PUBLISHABLE_KEY (opcional)
```

### Probar el deployment:
1. Haz un commit y push a `main`
2. Ve a **"Actions"** en tu repo de GitHub
3. Verifica que el workflow se ejecute sin errores

---

## 🚨 **Comandos de Emergencia**

Si algo sale mal, puedes hacer deploy manual:

```bash
# Backend manual
cd backend
railway login
railway deploy

# Frontend manual
npm run build
netlify deploy --prod

# Verificar health
curl https://api.la-economica.railway.app/api/health
```

---

## 📞 **Solución de Problemas**

### ❌ Error: "Railway token invalid"
- Regenera el token en Railway
- Actualiza el secret `RAILWAY_TOKEN`

### ❌ Error: "Netlify site not found"
- Verifica que `NETLIFY_SITE_ID` sea correcto
- Asegúrate de que el sitio exista en Netlify

### ❌ Error: "Build failed"
- Verifica que todas las variables estén configuradas
- Revisa los logs en Actions tab

---

## 🎯 **Resultado Esperado**

Una vez configurado:
1. **Push a `main`** → Deploy automático a producción
2. **Push a `develop`** → Deploy automático a staging
3. **Pull Request** → Tests automáticos
4. **Notificaciones** en caso de error

¡Ya tienes CI/CD completamente configurado! 🚀
