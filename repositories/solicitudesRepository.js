const Solicitud = require('../models/solicitudesModel');
const Usuario = require('../models/usuariosModel');
const Mascota = require('../models/mascotasModel');
const sequelize = require('../config/db');

const SolicitudesRepository = {
  async findAll() {
    try {
      return await Solicitud.findAll({
        include: [
          { 
            model: Usuario, 
            as: 'usuario', 
            attributes: ['nombre_usuario', 'email'] 
          },
          { 
            model: Mascota, 
            as: 'mascota', 
            attributes: ['nombre', 'id'] 
          }
        ],
        order: [['id', 'DESC']]
      });
    } catch (error) {
      console.error("Error detallado en findAll:", error.message);
      throw error;
    }
  },

  async updateStatus(id, nuevoEstado, idMascota) {
    const t = await sequelize.transaction();
    try {
      // 1. Actualizamos la solicitud
      // IMPORTANTE: Verifica que en tu DB la columna sea 'estado'
      await Solicitud.update(
        { estado: nuevoEstado }, 
        { where: { id }, transaction: t }
      );

      // 2. Actualizamos la mascota
      if (idMascota) {
        const animalEstado = nuevoEstado === 'Aprobada' ? 'Adoptado' : 'Disponible';
        await Mascota.update(
          { estado: animalEstado }, 
          { where: { id: idMascota }, transaction: t }
        );
      }

      await t.commit();
      return true;
    } catch (error) {
      if (t) await t.rollback();
      // ESTE LOG ES CLAVE: Mira la terminal de AWS cuando falles
      console.error("Error detallado en updateStatus:", error.message);
      throw error;
    }
  }
};

module.exports = SolicitudesRepository;