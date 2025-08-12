import express from 'express';
import os from 'os';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  const healthInfo = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
    },
    system: {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
      hostname: os.hostname()
    },
    database: {
      status: 'Connected', // Actualizar según tu DB
      latency: '< 5ms'     // Implementar ping real
    }
  };

  res.status(200).json(healthInfo);
});

// Readiness check (más estricto)
router.get('/ready', async (req, res) => {
  try {
    // Verificar conexiones críticas
    // await database.ping();
    // await redis.ping();
    
    res.status(200).json({
      status: 'Ready',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'OK',
        // redis: 'OK',
        // stripe: 'OK'
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'Not Ready',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Liveness check (básico)
router.get('/live', (req, res) => {
  res.status(200).json({
    status: 'Alive',
    timestamp: new Date().toISOString()
  });
});

export default router;
