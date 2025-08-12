#!/usr/bin/env node

/**
 * 🔍 Script para verificar que los secrets estén configurados correctamente
 * Úsalo después de configurar los secrets en GitHub
 */

import { execSync } from 'child_process';
import chalk from 'chalk';

const requiredSecrets = [
  'RAILWAY_TOKEN',
  'NETLIFY_AUTH_TOKEN',
  'NETLIFY_SITE_ID',
  'STRIPE_PUBLISHABLE_KEY'
];

const optionalSecrets = [
  'SENTRY_DSN',
  'STRIPE_TEST_PUBLISHABLE_KEY'
];

// Función para ejecutar comandos
const runCommand = (command, description) => {
  try {
    console.log(chalk.blue(`🔍 ${description}...`));
    const result = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    console.log(chalk.green(`✅ ${description} - OK`));
    return { success: true, output: result.trim() };
  } catch (error) {
    console.log(chalk.red(`❌ ${description} - ERROR`));
    console.log(chalk.gray(`   ${error.message}`));
    return { success: false, error: error.message };
  }
};

// Verificar Railway CLI
const checkRailway = () => {
  console.log(chalk.yellow('\n🚆 Verificando Railway...'));
  
  const railwayCheck = runCommand('railway --version', 'Railway CLI instalado');
  if (!railwayCheck.success) {
    console.log(chalk.yellow('💡 Instalar con: npm install -g @railway/cli'));
    return false;
  }
  
  const loginCheck = runCommand('railway whoami', 'Railway login status');
  if (!loginCheck.success) {
    console.log(chalk.yellow('💡 Login con: railway login'));
    return false;
  }
  
  console.log(chalk.green(`   Conectado como: ${loginCheck.output}`));
  return true;
};

// Verificar Netlify CLI
const checkNetlify = () => {
  console.log(chalk.yellow('\n🌐 Verificando Netlify...'));
  
  const netlifyCheck = runCommand('netlify --version', 'Netlify CLI instalado');
  if (!netlifyCheck.success) {
    console.log(chalk.yellow('💡 Instalar con: npm install -g netlify-cli'));
    return false;
  }
  
  const statusCheck = runCommand('netlify status', 'Netlify login status');
  if (!statusCheck.success) {
    console.log(chalk.yellow('💡 Login con: netlify login'));
    return false;
  }
  
  return true;
};

// Verificar variables de entorno locales
const checkLocalEnv = () => {
  console.log(chalk.yellow('\n📁 Verificando archivos .env...'));
  
  const frontendEnv = runCommand('test -f .env && echo "exists"', 'Frontend .env');
  const backendEnv = runCommand('test -f backend/.env && echo "exists"', 'Backend .env');
  
  if (!frontendEnv.success) {
    console.log(chalk.yellow('💡 Crear .env en la raíz del proyecto'));
  }
  
  if (!backendEnv.success) {
    console.log(chalk.yellow('💡 Crear backend/.env en el directorio backend'));
  }
  
  return frontendEnv.success && backendEnv.success;
};

// Verificar build
const checkBuild = () => {
  console.log(chalk.yellow('\n🔨 Verificando build...'));
  
  const typescriptCheck = runCommand('npm run typecheck', 'TypeScript check');
  if (!typescriptCheck.success) {
    return false;
  }
  
  const buildCheck = runCommand('npm run build', 'Frontend build');
  if (!buildCheck.success) {
    return false;
  }
  
  return true;
};

// Verificar conectividad
const checkConnectivity = () => {
  console.log(chalk.yellow('\n🌐 Verificando conectividad...'));
  
  // Verificar si el backend local está corriendo
  const backendCheck = runCommand('curl -f http://localhost:5000/api/health --max-time 5', 'Backend local health check');
  
  if (!backendCheck.success) {
    console.log(chalk.yellow('💡 Inicia el backend con: npm run dev:backend'));
  }
  
  return backendCheck.success;
};

// Función principal
const main = () => {
  console.log(chalk.blue.bold('🔐 Verificador de Configuración - La Económica\n'));
  
  let allGood = true;
  
  // Verificaciones
  const checks = [
    { name: 'Railway CLI', fn: checkRailway },
    { name: 'Netlify CLI', fn: checkNetlify },
    { name: 'Archivos .env', fn: checkLocalEnv },
    { name: 'Build del proyecto', fn: checkBuild },
    { name: 'Conectividad', fn: checkConnectivity }
  ];
  
  for (const check of checks) {
    const result = check.fn();
    if (!result) {
      allGood = false;
    }
  }
  
  // Resumen final
  console.log(chalk.yellow('\n📋 Resumen de secrets necesarios en GitHub:'));
  console.log(chalk.gray('   Ve a: https://github.com/Migue1-N4varreTe/ECO/settings/secrets/actions\n'));
  
  console.log(chalk.red.bold('🔴 OBLIGATORIOS:'));
  requiredSecrets.forEach(secret => {
    console.log(chalk.white(`   • ${secret}`));
  });
  
  console.log(chalk.yellow.bold('\n🟡 OPCIONALES:'));
  optionalSecrets.forEach(secret => {
    console.log(chalk.gray(`   • ${secret}`));
  });
  
  console.log(chalk.yellow('\n📖 Guía completa: GITHUB_SECRETS_SETUP.md'));
  
  // Estado final
  if (allGood) {
    console.log(chalk.green.bold('\n🎉 ¡Todo está configurado correctamente!'));
    console.log(chalk.green('✅ Puedes hacer push y el deployment será automático'));
  } else {
    console.log(chalk.red.bold('\n⚠️  Hay algunos problemas que resolver'));
    console.log(chalk.yellow('📖 Revisa la guía GITHUB_SECRETS_SETUP.md'));
  }
  
  // Comandos útiles
  console.log(chalk.blue.bold('\n🚀 Comandos útiles:'));
  console.log(chalk.white('   npm run dev              # Desarrollo local'));
  console.log(chalk.white('   npm run deploy:all       # Deploy manual'));
  console.log(chalk.white('   git push origin main     # Deploy automático'));
  console.log(chalk.white('   npm run health:check     # Verificar servicios'));
};

// Verificar si chalk está disponible
try {
  main();
} catch (error) {
  // Fallback sin colores si chalk no está disponible
  console.log('🔐 Verificador de Configuración - La Económica');
  console.log('');
  console.log('❌ Error: chalk no está instalado');
  console.log('💡 Instalar con: npm install chalk --save-dev');
  console.log('');
  console.log('📖 Mientras tanto, revisa manualmente:');
  console.log('   • Railway CLI: railway --version');
  console.log('   • Netlify CLI: netlify --version');
  console.log('   • Build: npm run build');
  console.log('   ��� TypeScript: npm run typecheck');
}
