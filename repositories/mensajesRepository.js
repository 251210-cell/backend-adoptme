const Mensaje = require('../models/mensajesModel');
const { Op } = require('sequelize');

const MensajesRepository = {
  /**
   * Obtener la charla específica entre un usuario y el admin sobre una mascota
   */
  async findByConversation(usuarioId, mascotaId) {
    return await Mensaje.findAll({
      where: {
        id_mascota: mascotaId,
        [Op.or]: [
          { id_remitente: usuarioId },
          { id_destinatario: usuarioId }
        ]
      },
      order: [['fecha_envio', 'ASC']] // Orden cronológico para que el chat tenga sentido
    });
  },

  /**
   * Obtener todos los mensajes de un usuario (Historial completo)
   * Usado por el chat del adoptante
   */
  async findByUser(usuarioId) {
    return await Mensaje.findAll({
      where: {
        [Op.or]: [
          { id_remitente: usuarioId },
          { id_destinatario: usuarioId }
        ]
      },
      order: [['fecha_envio', 'ASC']]
    });
  },

  async findAll() {
    return await Mensaje.findAll({ order: [['fecha_envio', 'DESC']] });
  },

  async findById(id) {
    return await Mensaje.findByPk(id);
  },

  async create(data) {
    // data debe contener: id_remitente, id_destinatario, id_mascota, contenido
    return await Mensaje.create({
        ...data,
        fecha_envio: new Date() // Aseguramos la fecha si no viene en data
    });
  },

  async update(id, data) {
    return await Mensaje.update(data, { where: { id } });
  },

  async delete(id) {
    return await Mensaje.destroy({ where: { id } });
  }
};

module.exports = MensajesRepository;