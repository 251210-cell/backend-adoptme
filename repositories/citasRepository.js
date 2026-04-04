const Cita = require('../models/citasModel');

const CitasRepository = {
  async findAll() {
    return await Cita.findAll();
  },

  async findById(id) {
    return await Cita.findByPk(id);
  },

  async create(data) {
    return await Cita.create(data);
  },

  async update(id, data) {
    return await Cita.update(data, { where: { id } });
  },

  async delete(id) {
    return await Cita.destroy({ where: { id } });
  }
};

module.exports = CitasRepository;