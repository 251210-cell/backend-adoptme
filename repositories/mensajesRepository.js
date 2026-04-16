const Mensaje = require('../models/mensajesModel');
const { Op } = require('sequelize');

const MensajesRepository = {
  // NUEVO: Obtener la charla específica para esta adopción
  async findByConversation(usuarioId, mascotaId) {
    return await Mensaje.findAll({
      where: {
        id_usuario: usuarioId,
        id_mascota: mascotaId
      },
      order: [['fecha_envio', 'ASC']] // Orden cronológico
    });
  },

  async findAll() {
    return await Mensaje.findAll();
  },

  async findById(id) {
    return await Mensaje.findByPk(id);
  },

  async create(data) {
    // data debe contener: id_usuario, id_mascota, contenido, enviado_por
    return await Mensaje.create(data);
  },

  async update(id, data) {
    return await Mensaje.update(data, { where: { id } });
  },

  async delete(id) {
    return await Mensaje.destroy({ where: { id } });
  }
};

module.exports = MensajesRepository;