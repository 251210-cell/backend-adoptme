const Usuario = require('../models/usuariosModel');

const UsuariosRepository = {
  async findAll() {
    return await Usuario.findAll();
  },

  async findById(id) {
    return await Usuario.findByPk(id);
  },

  async findByEmail(email) {
    return await Usuario.findOne({ where: { email } });
  },

  async create(data) {
    return await Usuario.create(data);
  },

  async update(id, data) {
    return await Usuario.update(data, { where: { id } });
  },

  async delete(id) {
    return await Usuario.destroy({ where: { id } });
  }
};

module.exports = UsuariosRepository;