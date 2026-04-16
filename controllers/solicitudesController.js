const SolicitudesRepository = require('../repositories/solicitudesRepository');

const SolicitudesController = {
  // Obtener todas las solicitudes para el panel admin
  async obtenerSolicitudes(req, res) {
    try {
      const solicitudes = await SolicitudesRepository.findAll();
      res.json(solicitudes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener una solicitud específica por su ID
  async obtenerSolicitudPorId(req, res) {
    try {
      const solicitud = await SolicitudesRepository.findById(req.params.id);
      if (!solicitud) return res.status(404).json({ error: 'No encontrada' });
      res.json(solicitud);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear una nueva solicitud (Desde el formulario del usuario)
  async crearSolicitud(req, res) {
    try {
      const nueva = await SolicitudesRepository.create(req.body);
      res.status(201).json(nueva);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * ACTUALIZAR SOLICITUD (Aprobar/Rechazar)
   * Corregido para usar los campos: estado e id_mascota
   */
  async actualizarSolicitud(req, res) {
    try {
      const { id } = req.params;
      // Extraemos los nombres exactos que enviamos desde el chat-admin.js
      const { estado, id_mascota } = req.body;
      
      // Validación: Si no llega el campo 'estado', devolvemos error 400
      if (!estado) {
          return res.status(400).json({ 
              error: 'El campo "estado" es obligatorio para actualizar.' 
          });
      }

      // Llamamos al repositorio con los datos corregidos
      await SolicitudesRepository.updateStatus(id, estado, id_mascota);
      
      res.json({ message: 'Estado de solicitud y mascota actualizado con éxito en la base de datos' });
    } catch (error) {
        console.error("Error en SolicitudesController:", error.message);
        res.status(500).json({ 
            error: 'Error interno al actualizar',
            detalle: error.message 
        });
    }
  },

  // Eliminar una solicitud
  async eliminarSolicitud(req, res) {
    try {
      await SolicitudesRepository.delete(req.params.id);
      res.json({ message: 'Solicitud eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = SolicitudesController;