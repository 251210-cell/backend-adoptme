// ============================================
// GUÍA: CONEXIÓN WEBSOCKET EN TIEMPO REAL
// ============================================

/**
 * ¿CÓMO SABER QUE FUNCIONA EN TIEMPO REAL?
 * 
 * 1. Abre el archivo test-websocket.html en el navegador
 * 2. Haz login (obtiene token JWT)
 * 3. Conecta WebSocket
 * 4. Abre OTRO navegador/pestaña con el mismo HTML
 * 5. Haz login con OTRO usuario
 * 6. Conecta WebSocket en la segunda pestaña
 * 7. Envía eventos desde una pestaña
 * 8. VES LOS EVENTOS EN REAL TIME EN LA OTRA PESTAÑA = FUNCIONA ✅
 */

// ============================================
// OPCIÓN 1: REACT (recomendado para frontend)
// ============================================

import { useEffect, useState } from 'react';
import io from 'socket.io-client';

function ChatComponent() {
  const [socket, setSocket] = useState(null);
  const [conectado, setConectado] = useState(false);
  const [eventos, setEventos] = useState([]);
  const [token, setToken] = useState(null);

  // 1. HACER LOGIN
  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3006/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'juan@example.com',
          contrasena: '123456'
        })
      });
      
      const data = await response.json();
      setToken(data.token);
      console.log('✅ Token obtenido:', data.token);
    } catch (error) {
      console.error('❌ Error login:', error);
    }
  };

  // 2. CONECTAR WEBSOCKET
  useEffect(() => {
    if (!token) return;

    const nuevoSocket = io('http://localhost:3006', {
      auth: {
        token: token
      }
    });

    // EVENTO: Conectado
    nuevoSocket.on('connect', () => {
      console.log('✅ WebSocket conectado:', nuevoSocket.id);
      setConectado(true);
    });

    // EVENTO: Nuevo Mensaje
    nuevoSocket.on('nuevo_mensaje', (data) => {
      console.log('💬 Mensaje recibido:', data);
      agregarEvento(`Mensaje de ${data.remitente_email}: ${data.contenido}`);
    });

    // EVENTO: Usuario escribiendo
    nuevoSocket.on('usuario_escribiendo', (data) => {
      console.log('⌨️ Usuario escribiendo');
      agregarEvento(`${data.usuarioEmail} está escribiendo...`);
    });

    // EVENTO: Nueva Mascota Creada
    nuevoSocket.on('mascota_creada', (data) => {
      console.log('🐾 Mascota creada:', data);
      agregarEvento(`Nueva mascota: ${data.nombre} (${data.raza})`);
    });

    // EVENTO: Nueva Solicitud
    nuevoSocket.on('solicitud_creada', (data) => {
      console.log('📝 Solicitud creada:', data);
      agregarEvento(`Nueva solicitud para mascota #${data.id_mascota}`);
    });

    // EVENTO: Usuario conectado
    nuevoSocket.on('usuario_conectado', (data) => {
      console.log('👤 Usuario conectado:', data.email);
      agregarEvento(`${data.email} se conectó (${data.usuariosConectados} online)`);
    });

    // EVENTO: Desconexión
    nuevoSocket.on('disconnect', () => {
      console.log('❌ WebSocket desconectado');
      setConectado(false);
    });

    // EVENTO: Error
    nuevoSocket.on('error', (error) => {
      console.error('Error WebSocket:', error);
    });

    setSocket(nuevoSocket);

    // CLEANUP
    return () => {
      nuevoSocket.disconnect();
    };
  }, [token]);

  // FUNCIÓN AUXILIAR
  const agregarEvento = (mensaje) => {
    setEventos(prev => [...prev, {
      id: Date.now(),
      mensaje: mensaje,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  // 3. ENVIAR MENSAJE
  const enviarMensaje = (contenido) => {
    if (!socket || !conectado) {
      console.error('No estás conectado');
      return;
    }
    
    socket.emit('mensaje', { contenido });
    console.log('📤 Mensaje enviado:', contenido);
  };

  // 4. EMITIR EVENTO DE ESCRITURA
  const emitirEscribiendo = () => {
    if (!socket || !conectado) return;
    socket.emit('usuario_escribiendo', { tipo: 'mensaje' });
  };

  return (
    <div>
      <h1>Chat en Tiempo Real</h1>
      
      <button onClick={handleLogin}>Login</button>
      <span style={{ marginLeft: '10px' }}>
        {conectado ? '🟢 Conectado' : '⚫ Desconectado'}
      </span>

      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h3>Eventos en Tiempo Real:</h3>
        {eventos.map(e => (
          <div key={e.id} style={{ padding: '5px', borderBottom: '1px solid #eee' }}>
            <small>[{e.timestamp}]</small> {e.mensaje}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        <textarea 
          id="mensaje"
          placeholder="Escribe un mensaje..."
          style={{ width: '100%', height: '80px' }}
        />
        <button 
          onClick={() => {
            const msg = document.getElementById('mensaje').value;
            enviarMensaje(msg);
            document.getElementById('mensaje').value = '';
          }}
        >
          Enviar
        </button>
        <button 
          onClick={emitirEscribiendo}
          style={{ marginLeft: '10px' }}
        >
          Escribiendo...
        </button>
      </div>
    </div>
  );
}

export default ChatComponent;


// ============================================
// OPCIÓN 2: VANILLA JAVASCRIPT (sin necesidad de frontend)
// ============================================

class WebSocketClient {
  constructor(apiUrl = 'http://localhost:3006') {
    this.apiUrl = apiUrl;
    this.socket = null;
    this.token = null;
    this.eventos = [];
  }

  // Login
  async login(email, password) {
    try {
      const response = await fetch(`${this.apiUrl}/api/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          contrasena: password
        })
      });

      const data = await response.json();
      this.token = data.token;
      console.log('✅ Login exitoso');
      return this.token;
    } catch (error) {
      console.error('❌ Error en login:', error);
      throw error;
    }
  }

  // Conectar WebSocket
  conectar() {
    if (!this.token) {
      throw new Error('Token requerido. Ejecuta login() primero');
    }

    // Importa socket.io en HTML: <script src="https://cdn.socket.io/4.8.3/socket.io.global.js"></script>
    this.socket = io(this.apiUrl, {
      auth: {
        token: this.token
      }
    });

    this.socket.on('connect', () => {
      console.log('✅ WebSocket conectado');
      this.registrarEvento('Sistema', 'WebSocket conectado', 'success');
    });

    this.socket.on('nuevo_mensaje', (data) => {
      console.log('💬 Mensaje recibido:', data);
      this.registrarEvento('Mensaje', `De ${data.remitente_email}: ${data.contenido}`, 'info');
    });

    this.socket.on('mascota_creada', (data) => {
      console.log('🐾 Mascota creada:', data);
      this.registrarEvento('Mascota', `${data.nombre} (${data.raza})`, 'success');
    });

    this.socket.on('usuario_escribiendo', (data) => {
      this.registrarEvento('Escribiendo', `${data.usuarioEmail} está escribiendo...`, 'warning');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ WebSocket desconectado');
      this.registrarEvento('Sistema', 'WebSocket desconectado', 'error');
    });

    this.socket.on('error', (error) => {
      console.error('Error WebSocket:', error);
      this.registrarEvento('Error', error, 'error');
    });
  }

  // Enviar mensaje
  enviarMensaje(contenido) {
    if (!this.socket?.connected) {
      console.error('No estás conectado');
      return;
    }
    this.socket.emit('mensaje', { contenido });
    console.log('📤 Mensaje enviado');
  }

  // Emitir evento de escribiendo
  emitirEscribiendo() {
    if (!this.socket?.connected) return;
    this.socket.emit('usuario_escribiendo', { tipo: 'mensaje' });
  }

  // Registrar evento
  registrarEvento(tipo, mensaje, nivel = 'info') {
    const evento = {
      timestamp: new Date().toLocaleTimeString(),
      tipo,
      mensaje,
      nivel
    };
    this.eventos.push(evento);
    console.log(`[${evento.timestamp}] ${tipo}: ${mensaje}`);
  }

  // Mostrar eventos
  mostrarEventos() {
    console.table(this.eventos);
  }
}

// USO:
/* 
const cliente = new WebSocketClient('http://localhost:3006');

// 1. Login
await cliente.login('juan@example.com', '123456');

// 2. Conectar
cliente.conectar();

// 3. Esperar a que se conecte (2 segundos)
setTimeout(() => {
  cliente.enviarMensaje('Hola desde JavaScript puro');
}, 2000);

// 4. Ver eventos
setTimeout(() => {
  cliente.mostrarEventos();
}, 5000);
*/


// ============================================
// VERIFICACIÓN EN LA CONSOLA DEL NAVEGADOR
// ============================================

/*
Pasos para verificar que funciona en TIEMPO REAL:

1. Abre test-websocket.html
   - Haz login
   - Conecta WebSocket
   - VE EL LOG EN VIVO

2. Abre OTRA PESTAÑA del mismo HTML con OTRO usuario
   - Haz login con otro email
   - Conecta WebSocket
   - VE NOTIFICACIONES DE LA OTRA PESTAÑA EN TIEMPO REAL

3. Envía eventos desde la primera pestaña
   - Los VES INMEDIATAMENTE en la segunda

4. Abre la consola (F12) en AMBAS PESTAÑAS
   - VES LOS console.log() de CADA evento
   - Prueba esto en la consola:
     socket.emit('usuario_escribiendo', { tipo: 'mensaje' })
   - LA OTRA PESTAÑA RECIBE EL EVENTO INSTANTÁNEAMENTE

5. Prueba desde Postman + navegador
   - Crea una mascota en Postman (POST /api/mascotas)
   - Los navegadores RECIBEN el evento 'mascota_creada' EN TIEMPO REAL

¡ESTO ES TIEMPO REAL PURO! ✅
*/


// ============================================
// CHECKLIST: ¿QUÉ VERIFICAR?
// ============================================

/*
✅ Conexión
   - Socket conecta con token JWT
   - Status dice "🟢 Conectado"
   - console.log muestra "connect"

✅ Bi-direccionalidad
   - Envías evento → otros lo reciben al instante
   - No esperas refrescas ni polleos

✅ Eventos en tiempo real
   - Crea mascota en Postman → navegador recibe evento inmediatamente
   - Crea solicitud en Postman → navegador recibe evento inmediatamente
   - Usuario se conecta → ves notificación en otra pestaña

✅ Múltiples usuarios
   - 2+ navegadores conectados simultáneamente
   - Eventos se sincronizan entre todos
   - Si uno se desconecta, los otros lo ven

✅ Persistencia
   - Pueden haber N sockets conectados
   - Cada uno recibe TODOS los eventos broadcast
   - Sin pérdida de datos

Si todo esto funciona → TU WEBSOCKET ESTÁ 100% FUNCIONAL EN TIEMPO REAL ✅
*/
