const MensajesRepository = require('../repositories/mensajesRepository');

const MensajesService = {
  // NUEVO: Para que el admin vea solo el chat de ESTA solicitud
  async obtenerConversacion(usuarioId, mascotaId) {
    return await MensajesRepository.findByConversation(usuarioId, mascotaId);
  },

  async obtenerMensajes() {
    return await MensajesRepository.findAll();
  },

  async obtenerMensajePorId(id) {
    return await MensajesRepository.findById(id);
  },

  async crearMensaje(data) {
    // Aquí puedes meter lógica de negocio, ej: validar palabras prohibidas
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