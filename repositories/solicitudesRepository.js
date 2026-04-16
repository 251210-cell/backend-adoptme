const Solicitud = require('../models/solicitudesModel');
const Usuario = require('../models/usuariosModel');
const Mascota = require('../models/mascotasModel');
const sequelize = require('../config/db');

const SolicitudesRepository = {
  async findAll() {
    try {
      return await Solicitud.findAll({
        include: [
          { model: Usuario, as: 'usuario', attributes: ['nombre_usuario', 'email'] },
          { model: Mascota, as: 'mascota', attributes: ['nombre', 'foto', 'id'] }
        ],
        order: [['id', 'DESC']]
      });
    } catch (error) {
      // ESTO NOS DIRÁ LA VERDAD EN LA TERMINAL
      console.error(" Error detallado en findAll:", error.message);
      throw error;
    }
  },
  async updateStatus(id, nuevoEstado, idMascota) {
    const t = await sequelize.transaction();
    try {
      // Actualiza la solicitud
      await Solicitud.update({ estado: nuevoEstado }, { where: { id }, transaction: t });

      // Actualiza la mascota: Si se aprueba queda 'Adoptado', si se rechaza vuelve a 'Disponible'
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