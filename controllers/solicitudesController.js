const SolicitudesRepository = require('../repositories/solicitudesRepository');

const SolicitudesController = {
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
      
      // Validamos que lleguen los datos
      if (!estado_solicitud) {
          return res.status(400).json({ error: 'El estado es obligatorio' });
      }

      await SolicitudesRepository.updateStatus(id, estado_solicitud, mascota_id);
      
      res.json({ message: 'Estado de solicitud y mascota actualizado con éxito' });
    } catch (error) {
        console.error("Error en controlador:", error.message);
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

module.exports = SolicitudesController;