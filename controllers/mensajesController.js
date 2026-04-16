+const Solicitud = require('../models/solicitudesModel');
const Usuario = require('../models/usuariosModel');
const Mascota = require('../models/mascotasModel');
const sequelize = require('../config/db');

const SolicitudesRepository = {
  async findAll() {
    return await Solicitud.findAll({
      include: [
        { model: Usuario, as: 'usuario', attributes: ['nombre_completo', 'email'] },
        { model: Mascota, as: 'mascota', attributes: ['nombre', 'foto', 'id'] }
      ],
      order: [['id', 'DESC']]
    });
  },

  async updateStatus(id, nuevoEstado, idMascota) {
    const t = await sequelize.transaction();
    try {
      // 1. Cambiamos estado de la solicitud
      await Solicitud.update({ estado: nuevoEstado }, { where: { id }, transaction: t });

      // 2. Cambiamos estado de la mascota
      // Si se aprueba -> Adoptado. Si se rechaza -> Disponible.
      const animalEstado = nuevoEstado === 'Aprobada' ? 'Adoptado' : 'Disponible';
      await Mascota.update({ estado: animalEstado }, { where: { id: idMascota }, transaction: t });

      await t.commit();
      return true;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
};

module.exports = SolicitudesRepository;