const Solicitud = require('../models/solicitudesModel');
const Usuario = require('../models/usuariosModel');
const Mascota = require('../models/mascotasModel');
const sequelize = require('../config/db');

const SolicitudesRepository = {
  // 1. Traer TODO para que el admin vea el formulario previo
  async findAll() {
    return await Solicitud.findAll({
      include: [
        { model: Usuario, as: 'usuario', attributes: ['nombre_completo', 'email'] },
        { model: Mascota, as: 'mascota', attributes: ['nombre', 'foto'] }
      ],
      order: [['fecha_solicitud', 'DESC']]
    });
  },

  // 2. El cambio de estado con lógica de negocio
  async updateStatus(id, nuevoEstado, idMascota) {
    const t = await sequelize.transaction();
    try {
      // Actualizar Solicitud (Pendiente -> Aprobada/Rechazada)
      await Solicitud.update({ estado: nuevoEstado }, { where: { id }, transaction: t });

      // Actualizar Mascota (Si aprueba: Adoptado / Si rechaza: Disponible)
      const animalEstado = nuevoEstado === 'Aprobada' ? 'Adoptado' : 'Disponible';
      await Mascota.update({ estado: animalEstado }, { where: { id: idMascota }, transaction: t });

      await t.commit();
      return true;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },

  async findById(id) {
    return await Solicitud.findByPk(id, { include: ['usuario', 'mascota'] });
  }
};

module.exports = SolicitudesRepository;