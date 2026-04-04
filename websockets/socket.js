const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;
const usuariosConectados = new Map(); // Almacenar usuarios conectados

const initializeWebSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // ========== MIDDLEWARE DE AUTENTICACIÓN ==========
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Token no proporcionado'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secret_key');
      socket.usuarioId = decoded.id;
      socket.usuarioEmail = decoded.email;
      socket.usuarioRol = decoded.rol;
      next();
    } catch (error) {
      return next(new Error('Token inválido'));
    }
  });

  // ========== CONEXIÓN EXITOSA ==========
  io.on('connection', (socket) => {
    console.log(`✅ Usuario conectado: ${socket.usuarioEmail} (${socket.id})`);

    // Almacenar usuario conectado
    usuariosConectados.set(socket.id, {
      usuarioId: socket.usuarioId,
      email: socket.usuarioEmail,
      rol: socket.usuarioRol,
      connectadoEn: new Date()
    });

    // Notificar que un usuario se conectó
    io.emit('usuario_conectado', {
      usuarioId: socket.usuarioId,
      email: socket.usuarioEmail,
      timestamp: new Date(),
      usuariosConectados: usuariosConectados.size
    });

    // ========== MENSAJES EN TIEMPO REAL ==========
    socket.on('mensaje', (data) => {
      console.log(`💬 Mensaje de ${socket.usuarioEmail}:`, data);
      
      io.emit('nuevo_mensaje', {
        id_remitente: socket.usuarioId,
        remitente_email: socket.usuarioEmail,
        contenido: data.contenido,
        timestamp: new Date(),
        socketId: socket.id
      });
    });

    // ========== NOTIFICACIONES EN TIEMPO REAL ==========
    socket.on('mascota_creada', (data) => {
      console.log(`🐾 Mascota creada por ${socket.usuarioEmail}`);
      
      io.emit('notificacion_mascota', {
        tipo: 'creada',
        mascota: data,
        creador: socket.usuarioEmail,
        timestamp: new Date()
      });
    });

    socket.on('solicitud_creada', (data) => {
      console.log(`📝 Solicitud creada por ${socket.usuarioEmail}`);
      
      io.emit('notificacion_solicitud', {
        tipo: 'creada',
        solicitud: data,
        solicitante: socket.usuarioEmail,
        timestamp: new Date()
      });
    });

    socket.on('cita_creada', (data) => {
      console.log(`📅 Cita creada por ${socket.usuarioEmail}`);
      
      io.emit('notificacion_cita', {
        tipo: 'creada',
        cita: data,
        creador: socket.usuarioEmail,
        timestamp: new Date()
      });
    });

    socket.on('solicitud_actualizada', (data) => {
      console.log(`✏️ Solicitud actualizada (estado: ${data.estado})`);
      
      io.emit('notificacion_solicitud_actualizada', {
        id_solicitud: data.id_solicitud,
        estado: data.estado,
        actualizado_por: socket.usuarioEmail,
        timestamp: new Date()
      });
    });

    // ========== TYPING INDICATORS ==========
    socket.on('usuario_escribiendo', (data) => {
      console.log(`⌨️ ${socket.usuarioEmail} está escribiendo...`);
      
      // Enviar a todos excepto al que está escribiendo
      socket.broadcast.emit('usuario_escribiendo', {
        usuarioEmail: socket.usuarioEmail,
        usuarioId: socket.usuarioId,
        tipo: data.tipo // 'mensaje', 'comentario', etc.
      });
    });

    socket.on('usuario_dejo_escribir', (data) => {
      console.log(`⌨️ ${socket.usuarioEmail} dejó de escribir`);
      
      socket.broadcast.emit('usuario_dejo_escribir', {
        usuarioEmail: socket.usuarioEmail,
        usuarioId: socket.usuarioId
      });
    });

    // ========== NOTIFICACIONES DE ACCIONES ==========
    socket.on('usuario_viendo_mascota', (data) => {
      io.emit('usuario_viendo', {
        usuarioEmail: socket.usuarioEmail,
        mascotaId: data.mascotaId,
        timestamp: new Date()
      });
    });

    socket.on('usuario_viendo_perfil', (data) => {
      io.emit('usuario_viendo_perfil', {
        usuarioEmail: socket.usuarioEmail,
        perfilId: data.perfilId,
        timestamp: new Date()
      });
    });

    // ========== NOTIFICACIONES DE MENSAJES LEÍDOS ==========
    socket.on('mensaje_leido', (data) => {
      io.emit('mensaje_marcado_como_leido', {
        idMensaje: data.idMensaje,
        leidoPor: socket.usuarioEmail,
        timestamp: new Date()
      });
    });

    // ========== OBTENER USUARIOS CONECTADOS ==========
    socket.on('obtener_usuarios_conectados', () => {
      const usuarios = Array.from(usuariosConectados.values()).map(u => ({
        usuarioId: u.usuarioId,
        email: u.email,
        conectadoEn: u.connectadoEn
      }));

      socket.emit('usuarios_conectados', {
        total: usuariosConectados.size,
        usuarios
      });
    });

    // ========== DESCONEXIÓN ==========
    socket.on('disconnect', () => {
      console.log(`❌ Usuario desconectado: ${socket.usuarioEmail} (${socket.id})`);

      usuariosConectados.delete(socket.id);

      io.emit('usuario_desconectado', {
        usuarioId: socket.usuarioId,
        email: socket.usuarioEmail,
        timestamp: new Date(),
        usuariosConectados: usuariosConectados.size
      });
    });

    // ========== MANEJO DE ERRORES ==========
    socket.on('error', (error) => {
      console.error(`Error en socket ${socket.id}:`, error);
    });
  });

  // Manejar errores de conexión
  io.on('connect_error', (error) => {
    console.error('Error de conexión WebSocket:', error.message);
  });
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io no está inicializado');
  }
  return io;
};

const getUsuariosConectados = () => {
  return Array.from(usuariosConectados.values());
};

module.exports = { initializeWebSocket, getIO, getUsuariosConectados };