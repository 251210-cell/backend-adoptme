const Solicitud = require('../models/solicitudesModel');

const SolicitudesRepository = {
  async findAll() {
    return await Solicitud.findAll();
  },

  async findById(id) {
    return await Solicitud.findByPk(id);
  },

  async create(data) {
    return await Solicitud.create(data);
  },

  async update(id, data) {
    return await Solicitud.update(data, { where: { id } });
  },

  async delete(id) {
    return await Solicitud.destroy({ where: { id } });
  }
};

module.exports = SolicitudesRepository;