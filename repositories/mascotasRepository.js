const Mascota = require('../models/mascotasModel');

const MascotasRepository = {
  async findAll() {
    return await Mascota.findAll();
  },

  async findById(id) {
    return await Mascota.findByPk(id);
  },

  async create(data) {
    return await Mascota.create(data);
  },

  async update(id, data) {
    return await Mascota.update(data, { where: { id } });
  },

  async delete(id) {
    return await Mascota.destroy({ where: { id } });
  }
};

module.exports = MascotasRepository;