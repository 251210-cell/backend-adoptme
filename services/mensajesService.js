const MensajesRepository = require('../repositories/mensajesRepository');

const MensajesService = {
  async obtenerMensajes() {
    return await MensajesRepository.findAll();
  },

  async obtenerMensajePorId(id) {
    return await MensajesRepository.findById(id);
  },

  async crearMensaje(data) {
    return await MensajesRepository.create(data);
  },

  async actualizarMensaje(id, data) {
    return await MensajesRepository.update(id, data);
  },

  async eliminarMensaje(id) {
    return await MensajesRepository.delete(id);
  }
};

module.exports = MensajesService;