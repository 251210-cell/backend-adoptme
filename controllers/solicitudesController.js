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
      const { id_usuario } = req.body;

      // --- LA CORRECCIÓN ESTÁ AQUÍ ---
      // Primero debemos obtener todas las solicitudes de la BD para poder filtrar
      const solicitudesExistentes = await SolicitudesRepository.findAll(); 

      // Ahora la variable ya existe y puedes usar filter
      const usuarioSolicitudes = solicitudesExistentes.filter(s => s.id_usuario == id_usuario);

      // 1. Bloqueo si ya tiene una mascota aprobada
      const yaTieneAdopcion = usuarioSolicitudes.find(s => s.estado === 'Aprobada');
      if (yaTieneAdopcion) {
          return res.status(400).json({ 
              error: 'Ya cuentas con una mascota adoptada. ¡Gracias por darle un hogar!' 
          });
      }

      // 2. Verificar si ya tiene una en proceso (Pendiente)
      const tienePendiente = usuarioSolicitudes.find(s => s.estado === 'Pendiente' || s.estado === 'En Revisión');
      if (tienePendiente) {
        return res.status(400).json({ 
          error: 'Ya tienes una solicitud en proceso. Espera a que sea revisada antes de enviar otra.' 
        });
      }

      // Si pasa las validaciones, procedemos a crear con todos los campos (edad, ocupación, etc.)
      const nueva = await SolicitudesRepository.create(req.body);
      res.status(201).json(nueva);
    } catch (error) {
      console.error("Error al crear solicitud:", error.message);
      res.status(500).json({ error: error.message });
    }
  },

  async actualizarSolicitud(req, res) {
    try {
      const { id } = req.params;
      const { estado, id_mascota, id_usuario, mensaje_admin, id_admin_actual } = req.body;
      
      if (!estado) {
          return res.status(400).json({ error: 'El campo "estado" es obligatorio.' });
      }

      await SolicitudesRepository.updateStatus(id, estado, id_mascota, id_usuario, mensaje_admin, id_admin_actual);
      res.json({ message: 'Solicitud procesada correctamente.' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno al actualizar', detalle: error.message });
    }
  },

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