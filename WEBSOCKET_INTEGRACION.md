# 🔌 Integración WebSocket con Controladores

## 📤 Cómo Emitir Eventos desde la API

### Paso 1: Importar getIO en tus controladores

```javascript
const { getIO } = require('../websockets/socket');

const TuController = {
  async crearAlgo(req, res) {
    try {
      const resultado = await TuService.crear(req.body);
      
      // Emitir evento WebSocket
      const io = getIO();
      io.emit('evento_nombre', {
        id: resultado.id,
        timestamp: new Date()
      });
      
      res.status(201).json(resultado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
```

---

## 🐾 Ejemplo: Mascota Creada

### En `controllers/mascotasController.js`

```javascript
const MascotasService = require('../services/mascotasService');
const { getIO } = require('../websockets/socket');

const MascotasController = {
  async crearMascota(req, res) {
    try {
      const nuevaMascota = await MascotasService.crearMascota(req.body);
      
      // Emitir evento a todos los clientes conectados
      const io = getIO();
      io.emit('mascota_creada', {
        id: nuevaMascota.id,
        nombre: nuevaMascota.nombre,
        raza: nuevaMascota.raza,
        edad: nuevaMascota.edad,
        tamano: nuevaMascota.tamano,
        foto: nuevaMascota.foto,
        estado_salud: nuevaMascota.estado_salud,
        descripcion: nuevaMascota.descripcion,
        refugio: nuevaMascota.refugio,
        creador_id: req.user.id,
        creador_email: req.user.email,
        timestamp: new Date()
      });

      res.status(201).json(nuevaMascota);
    } catch (error) {
      console.error('Error en crearMascota:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async actualizarMascota(req, res) {
    try {
      const mascotaActualizada = await MascotasService.actualizarMascota(req.params.id, req.body);
      
      // Emitir evento de actualización
      const io = getIO();
      io.emit('mascota_actualizada', {
        id: req.params.id,
        cambios: req.body,
        actualizado_por: req.user.email,
        timestamp: new Date()
      });

      res.json({ message: 'Mascota actualizada correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async eliminarMascota(req, res) {
    try {
      const eliminado = await MascotasService.eliminarMascota(req.params.id);
      
      // Emitir evento de eliminación
      const io = getIO();
      io.emit('mascota_eliminada', {
        id: req.params.id,
        eliminado_por: req.user.email,
        timestamp: new Date()
      });

      res.json({ message: 'Mascota eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = MascotasController;
```

---

## 📝 Ejemplo: Solicitud Creada

### En `controllers/solicitudesController.js`

```javascript
const SolicitudesService = require('../services/solicitudesService');
const { getIO } = require('../websockets/socket');

const SolicitudesController = {
  async crearSolicitud(req, res) {
    try {
      const nuevaSolicitud = await SolicitudesService.crearSolicitud(req.body);
      
      const io = getIO();
      io.emit('solicitud_creada', {
        id: nuevaSolicitud.id,
        id_usuario: req.body.id_usuario,
        id_mascota: req.body.id_mascota,
        ocupacion: nuevaSolicitud.ocupacion,
        edad_usuario: nuevaSolicitud.edad_usuario,
        motivo_adopcion: nuevaSolicitud.motivo_adopcion,
        estado: 'pendiente',
        creador_id: req.user.id,
        creador_email: req.user.email,
        timestamp: new Date()
      });

      res.status(201).json(nuevaSolicitud);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async actualizarSolicitud(req, res) {
    try {
      const solicitudActualizada = await SolicitudesService.actualizarSolicitud(req.params.id, req.body);
      
      const io = getIO();
      
      // Si cambió el estado, emitir evento específico
      if (req.body.estado) {
        io.emit('solicitud_actualizada', {
          id_solicitud: req.params.id,
          estado: req.body.estado,
          actualizado_por: req.user.email,
          timestamp: new Date()
        });
      }

      res.json({ message: 'Solicitud actualizada correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = SolicitudesController;
```

---

## 📅 Ejemplo: Cita Creada

### En `controllers/citasController.js`

```javascript
const CitasService = require('../services/citasService');
const { getIO } = require('../websockets/socket');

const CitasController = {
  async crearCita(req, res) {
    try {
      const nuevaCita = await CitasService.crearCita(req.body);
      
      const io = getIO();
      io.emit('cita_creada', {
        id: nuevaCita.id,
        id_usuario: req.body.id_usuario,
        id_mascota: req.body.id_mascota,
        fecha_visita: nuevaCita.fecha_visita,
        hora_visita: nuevaCita.hora_visita,
        notas_adicionales: nuevaCita.notas_adicionales,
        creador_id: req.user.id,
        creador_email: req.user.email,
        timestamp: new Date()
      });

      res.status(201).json(nuevaCita);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = CitasController;
```

---

## 💬 Ejemplo: Mensaje Creado

### En `controllers/mensajesController.js`

```javascript
const MensajesService = require('../services/mensajesService');
const { getIO } = require('../websockets/socket');

const MensajesController = {
  async crearMensaje(req, res) {
    try {
      const nuevoMensaje = await MensajesService.crearMensaje(req.body);
      
      const io = getIO();
      io.emit('mensaje_creado', {
        id: nuevoMensaje.id,
        id_remitente: req.body.id_remitente,
        id_destinatario: req.body.id_destinatario,
        id_mascota: req.body.id_mascota,
        contenido: nuevoMensaje.contenido,
        leido: false,
        creador_email: req.user.email,
        timestamp: new Date()
      });

      res.status(201).json(nuevoMensaje);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = MensajesController;
```

---

## 🎯 Eventos Recomendados

| Acción | Evento | Qué Emitir |
|--------|--------|-----------|
| Crear mascota | `mascota_creada` | Datos completos de mascota |
| Actualizar mascota | `mascota_actualizada` | ID + cambios |
| Eliminar mascota | `mascota_eliminada` | ID + quién lo hizo |
| Crear solicitud | `solicitud_creada` | Datos de solicitud |
| Cambiar estado solicitud | `solicitud_actualizada` | ID + nuevo estado |
| Crear cita | `cita_creada` | Datos de cita |
| Crear mensaje | `mensaje_creado` | Datos de mensaje |
| Marcar como leído | `mensaje_leido` | ID + quién lo leyó |
| Usuario se conecta | `usuario_conectado` | ID + email |
| Usuario se desconecta | `usuario_desconectado` | ID + email |

---

## 🔔 Notificaciones Personalizadas

### Para el dueño de la mascota
```javascript
socket.to(usuarioDuenoId).emit('solicitud_recibida', {
  mensaje: 'Nueva solicitud de adopción',
  mascota: 'Máx',
  solicitante: 'Juan Pérez'
});
```

### Para el solicitante
```javascript
socket.to(usuarioSolicitanteId).emit('solicitud_estado_cambio', {
  mensaje: 'Tu solicitud fue aprobada',
  estado: 'aprobada'
});
```

### Para administrador
```javascript
io.to('admin').emit('alerta_admin', {
  tipo: 'nueva_solicitud',
  detalles: solicitud
});
```

---

## 📋 Checklist de Integración

- [ ] Importar `getIO` en cada controlador que cree/actualice datos
- [ ] Emitir evento después de ciertos cambios
- [ ] Incluir datos relevantes en el evento
- [ ] Manejar errores correctamente
- [ ] Documentar qué eventos emite cada controlador
- [ ] Testear en Postman + Frontend

---

## 🚀 Siguiente Paso

Después de actualizar los controladores:

1. Instala `socket.io-client` en tu frontend
2. Crea un hook de conexión
3. Escucha los eventos de tu API
4. Muestra notificaciones en tiempo real

```bash
npm install socket.io-client
```

---

**Última actualización:** Marzo 27, 2026
**Versión:** 3.0 - Integración Completa ✅
