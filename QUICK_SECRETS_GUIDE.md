# ⚡ Guía Rápida - GitHub Secrets

## 🎯 **Pasos Mínimos para Configurar**

### **1. Ir a GitHub Secrets**
```
https://github.com/Migue1-N4varreTe/ECO/settings/secrets/actions
```

### **2. Obtener Tokens**

#### 🚆 **RAILWAY_TOKEN**
```bash
1. https://railway.app → Account Settings → Tokens
2. Create New Token: "la-economica-deploy"
3. Copiar token
```

#### 🌐 **NETLIFY_AUTH_TOKEN**
```bash
1. https://app.netlify.com → User Settings → Applications
2. New access token: "la-economica-github-actions"
3. Copiar token
```

#### 🆔 **NETLIFY_SITE_ID**
```bash
1. https://app.netlify.com → Tu sitio → Site settings
2. Copiar "Site ID" de la sección General
```

#### 💳 **STRIPE_PUBLISHABLE_KEY**
```bash
1. https://dashboard.stripe.com → Developers → API keys
2. Copiar "Publishable key" (pk_live_...)
```

### **3. Agregar en GitHub**
Para cada token:
1. Click "New repository secret"
2. Name: `NOMBRE_DEL_SECRET`
3. Secret: `valor_del_token`
4. Add secret

### **4. Verificar**
```bash
npm run verify:secrets
```

### **5. Test**
```bash
git add .
git commit -m "test: github actions"
git push origin main
```

## ✅ **Lista de Verificación**
- [ ] RAILWAY_TOKEN
- [ ] NETLIFY_AUTH_TOKEN
- [ ] NETLIFY_SITE_ID
- [ ] STRIPE_PUBLISHABLE_KEY
- [ ] Push a main branch
- [ ] Ver Actions tab funcionando

¡Listo! Deployment automático configurado 🚀
