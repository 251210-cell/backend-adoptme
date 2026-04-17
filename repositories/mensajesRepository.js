const Mensaje = require('../models/mensajesModel');
const { Op } = require('sequelize');

const MensajesRepository = {
  
  async findByConversation(usuarioId, mascotaId) {
    return await Mensaje.findAll({
      where: {
        id_mascota: mascotaId,
        [Op.or]: [
          { id_remitente: usuarioId },
          { id_destinatario: usuarioId }
        ]
      },
      order: [['fecha_envio', 'ASC']] 
    });
  },

 
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
   
    return await Mensaje.create({
        ...data,
        fecha_envio: new Date() 
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