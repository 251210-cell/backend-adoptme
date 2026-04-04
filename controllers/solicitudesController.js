const SolicitudesService = require('../services/solicitudesService');

const SolicitudesController = {
  async obtenerSolicitudes(req, res) {
    try {
      const solicitudes = await SolicitudesService.obtenerSolicitudes();
      res.json(solicitudes);
    } catch (error) {
      console.error('Error en obtenerSolicitudes:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerSolicitudPorId(req, res) {
    try {
      const solicitud = await SolicitudesService.obtenerSolicitudPorId(req.params.id);
      if (!solicitud) {
        return res.status(404).json({ error: 'Solicitud no encontrada' });
      }
      res.json(solicitud);
    } catch (error) {
      console.error('Error en obtenerSolicitudPorId:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async crearSolicitud(req, res) {
    try {
      console.log('Datos recibidos:', req.body);
      const nuevaSolicitud = await SolicitudesService.crearSolicitud(req.body);
      res.status(201).json(nuevaSolicitud);
    } catch (error) {
      console.error('Error en crearSolicitud:', error);
      res.status(500).json({ error: error.message, details: error.errors || [] });
    }
  },

  async actualizarSolicitud(req, res) {
    try {
      const solicitudActualizada = await SolicitudesService.actualizarSolicitud(req.params.id, req.body);
      if (!solicitudActualizada[0]) {
        return res.status(404).json({ error: 'Solicitud no encontrada' });
      }
      res.json({ message: 'Solicitud actualizada correctamente' });
    } catch (error) {
      console.error('Error en actualizarSolicitud:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async eliminarSolicitud(req, res) {
    try {
      const eliminado = await SolicitudesService.eliminarSolicitud(req.params.id);
      if (!eliminado) {
        return res.status(404).json({ error: 'Solicitud no encontrada' });
      }
      res.json({ message: 'Solicitud eliminada correctamente' });
    } catch (error) {
      console.error('Error en eliminarSolicitud:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = SolicitudesController;