const CitasRepository = require('../repositories/citasRepository');

const CitasService = {
  async obtenerCitas() {
    return await CitasRepository.findAll();
  },

  async obtenerCitaPorId(id) {
    return await CitasRepository.findById(id);
  },

  async crearCita(data) {
    return await CitasRepository.create(data);
  },

  async actualizarCita(id, data) {
    return await CitasRepository.update(id, data);
  },

  async eliminarCita(id) {
    return await CitasRepository.delete(id);
  }
};

module.exports = CitasService;