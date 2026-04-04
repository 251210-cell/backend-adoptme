# 📡 WebSocket - Guía de Uso Completa

## ✅ Características Implementadas

### 1. **Autenticación con JWT** ✅
- Solo usuarios autenticados pueden conectarse
- Token obligatorio en `handshake.auth`
- Validación en cada conexión

### 2. **Notificaciones en Tiempo Real** ✅
- Mascotas creadas
- Solicitudes creadas/actualizadas
- Citas creadas
- Estados de solicitudes

### 3. **Typing Indicators** ✅
- Ver quién está escribiendo
- Soporte para mensajes y comentarios
- Actualización en tiempo real

### 4. **Gestión de Usuarios Conectados** ✅
- Registro automático de usuarios
- Contador de conexiones
- Lista de usuarios online

---

## 🚀 Cómo Conectarse

### Desde Frontend (JavaScript/React)

```javascript
import io from 'socket.io-client';

// Conectar con el token JWT
const socket = io('http://localhost:3006', {
  auth: {
    token: 'tu_token_jwt_aqui'
  }
});

// Escuchar conexión exitosa
socket.on('connect', () => {
  console.log('✅ Conectado al servidor');
  console.log('Socket ID:', socket.id);
});

// Escuchar errores de conexión
socket.on('error', (error) => {
  console.error('Error:', error);
});

// Escuchar desconexión
socket.on('disconnect', () => {
  console.log('❌ Desconectado del servidor');
});
```

---

## 💬 Eventos de Mensajes

### Enviar Mensaje
```javascript
socket.emit('mensaje', {
  contenido: 'Hola, ¿cómo estás?'
});
```

### Recibir Mensaje
```javascript
socket.on('nuevo_mensaje', (data) => {
  console.log(`Nuevo mensaje de ${data.remitente_email}:`);
  console.log(data.contenido);
  console.log(`Enviado: ${data.timestamp}`);
});
```

---

## ⌨️ Typing Indicators

### El usuario comienza a escribir
```javascript
socket.emit('usuario_escribiendo', {
  tipo: 'mensaje' // or 'comentario'
});
```

### Mostrar indicador en otros clientes
```javascript
socket.on('usuario_escribiendo', (data) => {
  console.log(`${data.usuarioEmail} está escribiendo...`);
});
```

### El usuario dejó de escribir
```javascript
socket.emit('usuario_dejo_escribir', {});
```

### Escuchar que alguien dejó de escribir
```javascript
socket.on('usuario_dejo_escribir', (data) => {
  console.log(`${data.usuarioEmail} dejó de escribir`);
});
```

---

## 🐾 Notificaciones de Mascotas

### Crear Mascota (desde el servidor)
```javascript
// Cuando se crea una mascota en la API
socket.emit('mascota_creada', {
  id: 1,
  nombre: 'Máx',
  raza: 'Labrador',
  edad: '2 años',
  tamano: 'Grande'
});
```

### Recibir Notificación
```javascript
socket.on('notificacion_mascota', (data) => {
  console.log(`🐾 Nueva mascota: ${data.mascota.nombre}`);
  console.log(`Creada por: ${data.creador}`);
  console.log(`Timestamp: ${data.timestamp}`);
});
```

---

## 📝 Notificaciones de Solicitudes

### Crear Solicitud
```javascript
socket.emit('solicitud_creada', {
  id: 1,
  id_usuario: 5,
  id_mascota: 12,
  estado: 'pendiente'
});
```

### Recibir Notificación
```javascript
socket.on('notificacion_solicitud', (data) => {
  console.log(`📝 Nueva solicitud para ${data.solicitud.id_mascota}`);
  console.log(`Por: ${data.solicitante}`);
});
```

### Actualizar Estado de Solicitud
```javascript
socket.emit('solicitud_actualizada', {
  id_solicitud: 1,
  estado: 'aprobada' // o 'rechazada'
});
```

### Escuchar Actualización
```javascript
socket.on('notificacion_solicitud_actualizada', (data) => {
  console.log(`✏️ Solicitud #${data.id_solicitud}: ${data.estado}`);
  console.log(`Actualizado por: ${data.actualizado_por}`);
});
```

---

## 📅 Notificaciones de Citas

### Crear Cita
```javascript
socket.emit('cita_creada', {
  id: 1,
  id_usuario: 5,
  id_mascota: 12,
  fecha_visita: '2026-04-15',
  hora_visita: '14:30:00'
});
```

### Recibir Notificación
```javascript
socket.on('notificacion_cita', (data) => {
  console.log(`📅 Nueva cita: ${data.cita.fecha_visita}`);
  console.log(`Creada por: ${data.creador}`);
});
```

---

## 👥 Usuarios Conectados

### Obtener Lista de Usuarios Online
```javascript
socket.emit('obtener_usuarios_conectados');
```

### Recibir Lista
```javascript
socket.on('usuarios_conectados', (data) => {
  console.log(`Total de usuarios connectados: ${data.total}`);
  data.usuarios.forEach(usuario => {
    console.log(`- ${usuario.email} (ID: ${usuario.usuarioId})`);
  });
});
```

### Cuando se Conecta un Usuario
```javascript
socket.on('usuario_conectado', (data) => {
  console.log(`✅ ${data.email} se conectó`);
  console.log(`Usuarios online: ${data.usuariosConectados}`);
});
```

### Cuando se Desconecta un Usuario
```javascript
socket.on('usuario_desconectado', (data) => {
  console.log(`❌ ${data.email} se desconectó`);
  console.log(`Usuarios online: ${data.usuariosConectados}`);
});
```

---

## 📍 Notificaciones de Acciones

### Usuario Viendo una Mascota
```javascript
socket.emit('usuario_viendo_mascota', {
  mascotaId: 12
});
```

### Recibir Notificación
```javascript
socket.on('usuario_viendo', (data) => {
  console.log(`${data.usuarioEmail} está viendo la mascota #${data.mascotaId}`);
});
```

### Usuario Viendo un Perfil
```javascript
socket.emit('usuario_viendo_perfil', {
  perfilId: 5
});
```

### Recibir Notificación
```javascript
socket.on('usuario_viendo_perfil', (data) => {
  console.log(`${data.usuarioEmail} está viendo el perfil #${data.perfilId}`);
});
```

---

## ✅ Mensajes Leídos

### Marcar Mensaje como Leído
```javascript
socket.emit('mensaje_leido', {
  idMensaje: 42
});
```

### Notificar que fue Leído
```javascript
socket.on('mensaje_marcado_como_leido', (data) => {
  console.log(`Mensaje #${data.idMensaje} leído por ${data.leidoPor}`);
});
```

---

## 🛠️ Ejemplo Completo (React)

```jsx
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

function Chat({ token }) {
  const [socket, setSocket] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [usuariosOnline, setUsuariosOnline] = useState(0);
  const [escribiendo, setEscribiendo] = useState(null);

  useEffect(() => {
    // Conectar con autenticación
    const newSocket = io('http://localhost:3006', {
      auth: { token }
    });

    // Escuchar conexión
    newSocket.on('connect', () => {
      console.log('✅ Conectado');
      newSocket.emit('obtener_usuarios_conectados');
    });

    // Escuchar usuarios conectados
    newSocket.on('usuario_conectado', (data) => {
      setUsuariosOnline(data.usuariosConectados);
    });

    // Escuchar nuevos mensajes
    newSocket.on('nuevo_mensaje', (data) => {
      setMensajes(prev => [...prev, data]);
    });

    // Escuchar typing indicators
    newSocket.on('usuario_escribiendo', (data) => {
      setEscribiendo(data.usuarioEmail);
    });

    newSocket.on('usuario_dejo_escribir', () => {
      setEscribiendo(null);
    });

    // Notificaciones
    newSocket.on('notificacion_mascota', (data) => {
      alert(`🐾 Nueva mascota: ${data.mascota.nombre}`);
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [token]);

  const enviarMensaje = (contenido) => {
    socket?.emit('mensaje', { contenido });
  };

  const indicarEscribiendo = () => {
    socket?.emit('usuario_escribiendo', { tipo: 'mensaje' });
  };

  const indicarDejoEscribir = () => {
    socket?.emit('usuario_dejo_escribir', {});
  };

  return (
    <div>
      <h2>Chat en Vivo</h2>
      <p>👥 Usuarios online: {usuariosOnline}</p>
      
      {escribiendo && <p>⌨️ {escribiendo} está escribiendo...</p>}

      <div>
        {mensajes.map((msg, idx) => (
          <p key={idx}>
            <strong>{msg.remitente_email}:</strong> {msg.contenido}
          </p>
        ))}
      </div>

      <input
        placeholder="Escribe un mensaje..."
        onFocus={indicarEscribiendo}
        onBlur={indicarDejoEscribir}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            enviarMensaje(e.target.value);
            e.target.value = '';
          }
        }}
      />
    </div>
  );
}

export default Chat;
```

---

## ⚠️ Errores Comunes

### "Token no proporcionado"
```javascript
// ❌ Incorrecto
const socket = io('http://localhost:3006');

// ✅ Correcto
const socket = io('http://localhost:3006', {
  auth: { token: 'tu_token_aqui' }
});
```

### "Token inválido"
- Asegúrate que el token no esté expirado
- Verifica que sea el JWT correcto
- Asegúrate que JWT_SECRET coincida en servidor y cliente

### Desconexión espontánea
- Puede ser timeout (reconecta automáticamente)
- Verifica que el servidor esté corriendo
- Revisa la consola del navegador para más detalles

---

## 📊 Estados y Eventos

| Evento | Tipo | Descripción | Datos |
|--------|------|-------------|-------|
| `connect` | Escuchar | Conectado exitosamente | - |
| `disconnect` | Escuchar | Desconectado | - |
| `error` | Escuchar | Error de conexión | error |
| `usuario_conectado` | Escuchar | Nuevo usuario conectado | usuarioId, email |
| `usuario_desconectado` | Escuchar | Usuario se desconectó | usuarioId, email |
| `mensaje` | Enviar | Enviar un mensaje | contenido |
| `nuevo_mensaje` | Escuchar | Recibir mensaje | remitente_email, contenido |
| `usuario_escribiendo` | Enviar | Indicar que escribe | tipo |
| `usuario_escribiendo` | Escuchar | Ver quién escribe | usuarioEmail, usuarioId |
| `usuario_dejo_escribir` | Ambos | Usuario dejó de escribir | usuarioEmail |
| `mascota_creada` | Enviar | Nueva mascota | mascota |
| `notificacion_mascota` | Escuchar | Notif de mascota | tipo, mascota, creador |
| `solicitud_creada` | Enviar | Nueva solicitud | solicitud |
| `solicitud_actualizada` | Enviar | Cambio de estado | id_solicitud, estado |
| `cita_creada` | Enviar | Nueva cita | cita |
| `mensaje_leido` | Enviar | Marcar como leído | idMensaje |

---

## 🔐 Seguridad

✅ **Token OAuth JWT requerido** para conectarse
✅ **Validación en cada evento** (pendiente)
✅ **CORS configurado** para origen específico
✅ **Manejo de errores** de conexión

---

**Última actualización:** Marzo 27, 2026
**Versión:** 3.0 - WebSocket Completo ✅
