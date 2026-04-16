const SolicitudesRepository = require('../repositories/solicitudesRepository');

const SolicitudesController = {
  // 1. Debe llamarse exactamente obtenerSolicitudes
  async obtenerSolicitudes(req, res) {
    try {
      const solicitudes = await SolicitudesRepository.findAll();
      res.json(solicitudes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerSolicitudPorId(req, res) {
    try {
      const solicitud = await SolicitudesRepository.findById(req.params.id);
      if (!solicitud) return res.status(404).json({ error: 'No encontrada' });
      res.json(solicitud);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async crearSolicitud(req, res) {
    try {
      const nueva = await SolicitudesRepository.create(req.body);
      res.status(201).json(nueva);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async actualizarSolicitud(req, res) {
    try {
      const { id } = req.params;
      const { estado_solicitud, mascota_id } = req.body;
      
      // Llamamos a tu nuevo repositorio que usa transacciones
      await SolicitudesRepository.updateStatus(id, estado_solicitud, mascota_id);
      
      res.json({ message: 'Estado de solicitud y mascota actualizado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async eliminarSolicitud(req, res) {
    try {
      await SolicitudesRepository.delete(req.params.id);
      res.json({ message: 'Eliminada' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

// VITAL: Si esto no está, las rutas fallan con el error de tu captura
module.exports = SolicitudesController;