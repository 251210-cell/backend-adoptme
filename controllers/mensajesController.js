const MensajesService = require('../services/mensajesService');

const MensajesController = {
  // Obtener todos los mensajes
  async obtenerMensajes(req, res) {
    try {
      const mensajes = await MensajesService.obtenerMensajes();
      res.json(mensajes);
    } catch (error) {
      console.error('Error en obtenerMensajes:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // ESTA ES LA FUNCIÓN QUE DABA ERROR
  async obtenerMensajePorId(req, res) {
    try {
      // 1. Extraemos el id de los parámetros de la petición (req.params)
      const { id } = req.params; 
      
      // 2. Ahora sí usamos 'id' para llamar al servicio
      // Nota: Verifica si tu servicio se llama 'obtenerPorUsuario' o 'obtenerMensajePorId'
      const mensajes = await MensajesService.obtenerPorUsuario(id);
      
      if (!mensajes || mensajes.length === 0) {
        return res.status(404).json({ error: 'No hay mensajes para este usuario' });
      }
      res.json(mensajes);
    } catch (error) {
      console.error('Error en obtenerMensajePorId:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async crearMensaje(req, res) {
    try {
      console.log('Datos recibidos para nuevo mensaje:', req.body);
      const nuevoMensaje = await MensajesService.crearMensaje(req.body);
      res.status(201).json(nuevoMensaje);
    } catch (error) {
      console.error('Error en crearMensaje:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async actualizarMensaje(req, res) {
    try {
      const { id } = req.params;
      const mensajeActualizado = await MensajesService.actualizarMensaje(id, req.body);
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
      const { id } = req.params;
      const eliminado = await MensajesService.eliminarMensaje(id);
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