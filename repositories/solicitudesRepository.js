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
          { model: Mascota, as: 'mascota', attributes: ['nombre', 'id'] }
        ],
        order: [['id', 'DESC']]
      });
    } catch (error) {
      console.error("Error en findAll:", error.message);
      throw error;
    }
  },

  async updateStatus(id, nuevoEstado, idMascota) {
    // Usamos una lógica más simple sin transacción para detectar el error rápido
    try {
      console.log(`Intentando actualizar solicitud ${id} a estado: ${nuevoEstado}`);
      
      // 1. Actualizar la Solicitud
      const resultado = await Solicitud.update(
        { estado: nuevoEstado }, 
        { where: { id: id } }
      );

      // 2. Intentar actualizar la Mascota (Si falla, no detendrá lo anterior)
      try {
        if (idMascota) {
          const mEstado = nuevoEstado === 'Aprobada' ? 'Adoptado' : 'Disponible';
          await Mascota.update({ estado: mEstado }, { where: { id: idMascota } });
        }
      } catch (errMascota) {
        console.error("Error secundario al actualizar mascota:", errMascota.message);
      }

      return true;
    } catch (error) {
      console.error("ERROR CRÍTICO en updateStatus:", error.message);
      throw error;
    }
  }
};

module.exports = SolicitudesRepository;