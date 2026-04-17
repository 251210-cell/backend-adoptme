const MensajesService = require('../services/mensajesService');

const MensajesController = {

  async obtenerMensajes(req, res) {
    try {
      const mensajes = await MensajesService.obtenerMensajes();
      res.json(mensajes);
    } catch (error) {
      console.error('Error en obtenerMensajes:', error);
      res.status(500).json({ error: error.message });
    }
  },

  
   
  async obtenerMensajePorId(req, res) {
    try {
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