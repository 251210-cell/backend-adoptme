const MensajesRepository = require('../repositories/mensajesRepository');

const MensajesService = {
  /**
   * Obtiene la conversación específica entre el admin y un usuario 
   * sobre una mascota en particular.
   */
  async obtenerConversacion(usuarioId, mascotaId) {
    return await MensajesRepository.findByConversation(usuarioId, mascotaId);
  },

  /**
   * Obtiene todos los mensajes donde el usuario participa
   * (Ya sea como remitente o como destinatario)
   */
  async obtenerPorUsuario(usuarioId) {
    // Usamos el repositorio para traer el historial del usuario
    return await MensajesRepository.findByUser(usuarioId);
  },

  async obtenerMensajes() {
    return await MensajesRepository.findAll();
  },

  async obtenerMensajePorId(id) {
    return await MensajesRepository.findById(id);
  },

  async crearMensaje(data) {
    // Validamos que el contenido no esté vacío antes de enviarlo al repo
    if (!data.contenido || data.contenido.trim() === "") {
        throw new Error("El mensaje no puede estar vacío");
    }
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