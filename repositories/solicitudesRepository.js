const Solicitud = require('../models/solicitudesModel');
const Usuario = require('../models/usuariosModel');
const Mascota = require('../models/mascotasModel');

const SolicitudesRepository = {
  // Obtener todas con JOIN
  async findAll() {
    const solicitudes = await Solicitud.findAll({
      include: [
        { model: Usuario, as: 'usuario', attributes: ['nombre_completo'] },
        { model: Mascota, as: 'mascota', attributes: ['nombre'] }
      ],
      order: [['fecha_solicitud', 'DESC']]
    });

    return solicitudes.map(s => {
      const item = s.toJSON();
      return {
        ...item,
        nombre_usuario: item.usuario ? item.usuario.nombre_completo : 'Usuario Desconocido',
        nombre_mascota: item.mascota ? item.mascota.nombre : 'Mascota Desconocida'
      };
    });
  },

  async findById(id) {
    return await Solicitud.findByPk(id, {
      include: [
        { model: Usuario, as: 'usuario', attributes: ['nombre_completo'] },
        { model: Mascota, as: 'mascota', attributes: ['nombre'] }
      ]
    });
  },

  // Función para Aprobar/Rechazar y cambiar estado de mascota
  async updateStatus(id, estadoSolicitud, idMascota, estadoMascota) {
    // 1. Actualizar Solicitud
    await Solicitud.update({ estado: estadoSolicitud }, { where: { id } });
    
    // 2. Actualizar Mascota
    if (idMascota) {
      await Mascota.update({ estado: estadoMascota }, { where: { id: idMascota } });
    }
    return true;
  },

  async create(data) {
    return await Solicitud.create(data);
  },

  async delete(id) {
    return await Solicitud.destroy({ where: { id } });
  }
};

module.exports = SolicitudesRepository;