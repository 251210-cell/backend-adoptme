const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { initializeWebSocket } = require('./websockets/socket');
const sequelize = require('./config/db');
const config = require('./config/environment');

// Cargar rutas
const usuariosRoutes = require('./routes/usuariosRoutes');
const mascotasRoutes = require('./routes/mascotasRoutes');
const solicitudesRoutes = require('./routes/solicitudesRoutes');
const citasRoutes = require('./routes/citasRoutes');
const mensajesRoutes = require('./routes/mensajesRoutes');

// Configuración de variables de entorno
dotenv.config();

const app = express();
const PORT = config.port;

// ========== MIDDLEWARES GLOBALES ==========

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging con Morgan
app.use(morgan('combined'));

// Parsing de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: config.api.rateLimit.windowMs,
  max: config.api.rateLimit.maxRequests,
  message: 'Demasiadas solicitudes desde esta IP, por favor intenta más tarde.',
  standardHeaders: true,
  legacyHeaders: false
});

// Aplicar rate limit a todas las rutas
app.use('/api/', limiter);

// ========== RUTAS ==========
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/mascotas', mascotasRoutes);
app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/mensajes', mensajesRoutes);

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ========== MANEJO DE ERRORES ==========
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Errores de validación
  if (err.array) {
    return res.status(400).json({ 
      error: 'Datos inválidos',
      details: err.array()
    });
  }

  // Errores generales
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// ========== INICIAR SERVIDOR ==========
const server = http.createServer(app);
initializeWebSocket(server);

async function startServer() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    console.log({
      database: config.db.database,
      user: config.db.user,
      host: config.db.host
    });

    await sequelize.authenticate();
    console.log('✅ Conexión a BD establecida');

    server.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Error al conectar a la BD:');
    console.error('Mensaje:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

startServer();

module.exports = app;