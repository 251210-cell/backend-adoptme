const MensajesService = require('../services/mensajesService');

const MensajesController = {
  // Obtener todos los mensajes (Uso general/Admin)
  async obtenerMensajes(req, res) {
    try {
      const mensajes = await MensajesService.obtenerMensajes();
      res.json(mensajes);
    } catch (error) {
      console.error('Error en obtenerMensajes:', error);
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * OBTENER MENSAJES DE UN USUARIO ESPECÍFICO
   * Este es el que usa el chat del usuario para ver su historial
   */
  async obtenerMensajePorId(req, res) {
    try {
      const { id } = req.params; // Este 'id' es el usuarioId del localStorage
      
      // Llamamos al servicio para buscar la conversación
      const mensajes = await MensajesService.obtenerPorUsuario(id);
      
      if (!mensajes) {
        return res.status(404).json({ error: 'No hay mensajes para este usuario' });
      }
      res.json(mensajes);
    } catch (error) {
      console.error('Error en obtenerMensajePorId:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Crear mensaje (Desde Admin o Usuario)
  async crearMensaje(req, res) {
    try {
      console.log('Datos recibidos para nuevo mensaje:', req.body);
      
      // El body ya debe traer id_remitente, id_destinatario, id_mascota y contenido
      const nuevoMensaje = await MensajesService.crearMensaje(req.body);
      res.status(201).json(nuevoMensaje);
    } catch (error) {
      console.error('Error en crearMensaje:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async actualizarMensaje(req, res) {
    try {
      const mensajeActualizado = await MensajesService.actualizarMensaje(req.params.id, req.body);
      if (!mensajeActualizado) {
        return res.status(404).json({ error: 'Mensaje no encontrado' });
      }
      res.json({ message: 'Mensaje actualizado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async eliminarMensaje(req, res) {
    try {
      const eliminado = await MensajesService.eliminarMensaje(req.params.id);
      if (!eliminado) {
        return res.status(404).json({ error: 'Mensaje no encontrado' });
      }
      res.json({ message: 'Mensaje eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = MensajesController;