const SolicitudesRepository = require('../repositories/solicitudesRepository');

const SolicitudesService = {
  async obtenerSolicitudes() {
    return await SolicitudesRepository.findAll();
  },

  async obtenerSolicitudPorId(id) {
    return await SolicitudesRepository.findById(id);
  },

  async crearSolicitud(data) {
    return await SolicitudesRepository.create(data);
  },

  async actualizarSolicitud(id, data) {
    return await SolicitudesRepository.update(id, data);
  },

  async eliminarSolicitud(id) {
    return await SolicitudesRepository.delete(id);
  }
};

module.exports = SolicitudesService;