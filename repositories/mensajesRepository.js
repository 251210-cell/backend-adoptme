const Mensaje = require('../models/mensajesModel');

const MensajesRepository = {
  async findAll() {
    return await Mensaje.findAll();
  },

  async findById(id) {
    return await Mensaje.findByPk(id);
  },

  async create(data) {
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