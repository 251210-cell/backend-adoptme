const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { initializeWebSocket } = require('./websockets/socket');
const sequelize = require('./config/db');
const config = require('./config/environment');


dotenv.config();


const app = express();
const PORT = config.port;


const usuariosRoutes = require('./routes/usuariosRoutes');
const mascotasRoutes = require('./routes/mascotasRoutes');
const solicitudesRoutes = require('./routes/solicitudesRoutes');
const citasRoutes = require('./routes/citasRoutes');
const mensajesRoutes = require('./routes/mensajesRoutes');
const nosotrosRoutes = require('./routes/nosotrosRoutes'); 
const upload = require('./middlewares/upload'); 




app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(morgan('combined'));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const limiter = rateLimit({
  windowMs: config.api.rateLimit.windowMs,
  max: config.api.rateLimit.maxRequests,
  message: 'Demasiadas solicitudes desde esta IP, por favor intenta más tarde.',
  standardHeaders: true,
  legacyHeaders: false
});


app.use('/api/', limiter);




app.post('/api/upload', upload.single('image'), (req, res) => {
    if (req.file) {
        
        res.json({ url: req.file.path }); 
    } else {
        res.status(400).json({ error: 'No se pudo subir la imagen' });
    }
});


app.use('/api/usuarios', usuariosRoutes);
app.use('/api/mascotas', mascotasRoutes);
app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/mensajes', mensajesRoutes);
app.use('/api/nosotros', nosotrosRoutes); 


app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});


app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});


app.use((err, req, res, next) => {
  console.error('Error Detectado:', err.stack);
  
  if (err.array) { 
    return res.status(400).json({ 
      error: 'Datos inválidos',
      details: err.array()
    });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});


const server = http.createServer(app);
initializeWebSocket(server);

async function startServer() {
  try {
    console.log('--- Iniciando Conexión a Base de Datos ---');
    console.log(`Base: ${config.db.database} | Host: ${config.db.host}`);

 
    await sequelize.authenticate();
    console.log(' Conexión a BD establecida correctamente.');

   
    await sequelize.sync({ alter: true });
    console.log('Tablas sincronizadas (Alter: true).');

    server.listen(PORT, () => {
      console.log(` Servidor corriendo en http://localhost:${PORT}`);
      console.log(` Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌Error crítico al iniciar el servidor:');
    console.error('Mensaje:', error.message);
    process.exit(1);
  }
}

startServer();

module.exports = app;