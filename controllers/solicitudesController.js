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

      // VALIDACIÓN: Solo una adopción exitosa o una pendiente a la vez
      const solicitudesExistentes = await SolicitudesRepository.findAll(); 
      // Nota: Si tu repository tiene un método findByUsuario úsalo para mejor rendimiento
      
      const usuarioSolicitudes = solicitudesExistentes.filter(s => s.id_usuario == id_usuario);

      // 1. Verificar si ya tiene una aprobada
      const yaTieneAdopcion = usuarioSolicitudes.find(s => s.estado === 'Aprobada');
      if (yaTieneAdopcion) {
        return res.status(400).json({ 
          error: 'Ya cuentas con una mascota adoptada. ¡Gracias por tu gran corazón!' 
        });
      }

      // 2. Verificar si ya tiene una en proceso
      const tienePendiente = usuarioSolicitudes.find(s => s.estado === 'Pendiente' || s.estado === 'En Revisión');
      if (tienePendiente) {
        return res.status(400).json({ 
          error: 'Ya tienes una solicitud en proceso. Espera a que sea revisada antes de enviar otra.' 
        });
      }

      // Si pasa las validaciones, procedemos a crear
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
      
      const { 
        estado, 
        id_mascota, 
        id_usuario,      
        mensaje_admin,   
        id_admin_actual  
      } = req.body;
      
      if (!estado) {
          return res.status(400).json({ 
              error: 'El campo "estado" es obligatorio para actualizar.' 
          });
      }

      await SolicitudesRepository.updateStatus(
          id, 
          estado, 
          id_mascota, 
          id_usuario, 
          mensaje_admin, 
          id_admin_actual
      );
      
      res.json({ message: 'Solicitud procesada y mensaje enviado al chat del usuario.' });
    } catch (error) {
        console.error("Error en SolicitudesController:", error.message);
        res.status(500).json({ 
            error: 'Error interno al actualizar',
            detalle: error.message 
        });
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