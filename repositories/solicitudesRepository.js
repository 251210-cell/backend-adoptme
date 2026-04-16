const Solicitud = require('../models/solicitudesModel');
const Mascota = require('../models/mascotasModel');

const SolicitudesRepository = {
  async findAll() {
    return await Solicitud.findAll();
  },

  async findById(id) {
    return await Solicitud.findByPk(id);
  },

  async updateStatus(id, estadoSolicitud, idMascota, estadoMascota) {
    try {
      // 1. Actualizar la solicitud: el campo en tu DB es 'estado'
      await Solicitud.update(
        { estado: estadoSolicitud }, 
        { where: { id: id } }
      );

      // 2. Actualizar la mascota si se proporciona el ID
      if (idMascota) {
        await Mascota.update(
          { estado: estadoMascota }, 
          { where: { id: idMascota } }
        );
      }
      return true;
    } catch (error) {
      console.error("Error en updateStatus:", error);
      throw error;
    }
  },

  async create(data) {
    return await Solicitud.create(data);
  },

  async delete(id) {
    return await Solicitud.destroy({ where: { id: id } });
  }
};

module.exports = SolicitudesRepository;