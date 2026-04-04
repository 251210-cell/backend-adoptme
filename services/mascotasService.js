const MascotasRepository = require('../repositories/mascotasRepository');

const MascotasService = {
  async obtenerMascotas() {
    return await MascotasRepository.findAll();
  },

  async obtenerMascotaPorId(id) {
    return await MascotasRepository.findById(id);
  },

  async crearMascota(data) {
    return await MascotasRepository.create(data);
  },

  async actualizarMascota(id, data) {
    return await MascotasRepository.update(id, data);
  },

  async eliminarMascota(id) {
    return await MascotasRepository.delete(id);
  }
};

module.exports = MascotasService;