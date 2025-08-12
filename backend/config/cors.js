const allowedOrigins = [
  // Desarrollo local
  'http://localhost:8080',
  'http://localhost:5173',
  'http://127.0.0.1:8080',
  'http://127.0.0.1:5173',
  
  // Netlify deployments
  'https://la-economica.netlify.app',
  'https://staging--la-economica.netlify.app',
  'https://dev--la-economica.netlify.app',
  
  // Railway frontend (si se usa)
  'https://la-economica-frontend.railway.app',
  
  // Otros dominios de producción
  'https://laeconomica.com',
  'https://www.laeconomica.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (ej: aplicaciones móviles)
    if (!origin) return callback(null, true);
    
    // Verificar si el origin está en la lista permitida
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // En desarrollo, permitir cualquier localhost
      if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
        callback(null, true);
      } else {
        console.error(`CORS: Origin ${origin} not allowed`);
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  
  // Configuraciones adicionales
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-Access-Token'
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400, // 24 horas
  optionsSuccessStatus: 200
};

export default corsOptions;
