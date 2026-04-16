const Solicitud = require('../models/solicitudesModel');
const Mascota = require('../models/mascotasModel');
const Usuario = require('../models/usuariosModel');

const SolicitudesRepository = {
  // Obtener todas con los nombres de usuario y mascota
  async findAll() {
    try {
      const solicitudes = await Solicitud.findAll({
        include: [
          { model: Usuario, as: 'usuario', attributes: ['nombre_completo'] },
          { model: Mascota, as: 'mascota', attributes: ['nombre'] }
        ],
        order: [['id', 'DESC']]
      });

      return solicitudes.map(s => {
        const item = s.toJSON();
        return {
          ...item,
          nombre_usuario: item.usuario ? item.usuario.nombre_completo : 'Invitado',
          nombre_mascota: item.mascota ? item.mascota.nombre : 'Mascota'
        };
      });
    } catch (error) {
      throw error;
    }
  },

  // ESTA ES LA FUNCIÓN CRÍTICA
  async updateStatus(id, estadoSolicitud, idMascota, estadoMascota) {
    try {
      // 1. Actualizar la tabla 'solicitudes'
      // Usamos 'estado' porque así aparece en tu DESCRIBE de MySQL
      await Solicitud.update(
        { estado: estadoSolicitud }, 
        { where: { id: id } }
      );

      // 2. Actualizar la tabla 'mascotas' (poner como Adoptado)
      if (idMascota) {
        await Mascota.update(
          { estado: estadoMascota }, 
          { where: { id: idMascota } }
        );
      }
      return true;
    } catch (error) {
      console.error("Error en Repository updateStatus:", error);
      throw error;
    }
  },

  async findById(id) {
    return await Solicitud.findByPk(id);
  },

  async create(data) {
    return await Solicitud.create(data);
  },

  async delete(id) {
    return await Solicitud.destroy({ where: { id: id } });
  }
};

module.exports = SolicitudesRepository;