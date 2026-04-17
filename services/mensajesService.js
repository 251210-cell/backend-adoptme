const MensajesRepository = require('../repositories/mensajesRepository');

const MensajesService = {
 
  async obtenerConversacion(usuarioId, mascotaId) {
    return await MensajesRepository.findByConversation(usuarioId, mascotaId);
  },

 
   
  async obtenerPorUsuario(usuarioId) {
    
    return await MensajesRepository.findByUser(usuarioId);
  },

  async obtenerMensajes() {
    return await MensajesRepository.findAll();
  },

  async obtenerMensajePorId(id) {
    return await MensajesRepository.findById(id);
  },

  async crearMensaje(data) {
    
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