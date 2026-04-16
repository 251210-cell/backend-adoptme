const Solicitud = require('../models/solicitudesModel');
const Usuario = require('../models/usuariosModel'); // Importante: Verifica que la ruta sea correcta
const Mascota = require('../models/mascotasModel'); // Importante: Verifica que la ruta sea correcta

const SolicitudesRepository = {
  async findAll() {
    // Aquí es donde sucede la magia del JOIN
    const solicitudes = await Solicitud.findAll({
      include: [
        {
          model: Usuario,
          as: 'usuario', // Este alias debe existir en tus asociaciones
          attributes: ['nombre_completo'] 
        },
        {
          model: Mascota,
          as: 'mascota',
          attributes: ['nombre']
        }
      ]
    });

    // Mapeamos para que el Frontend reciba los nombres limpios
    return solicitudes.map(s => {
      const item = s.toJSON();
      return {
        ...item,
        nombre_usuario: item.usuario ? item.usuario.nombre_completo : 'Usuario Desconocido',
        nombre_mascota: item.mascota ? item.mascota.nombre : 'Mascota Desconocida'
      };
    });
  },

  async findById(id) {
    return await Solicitud.findByPk(id, {
      include: [
        { model: Usuario, as: 'usuario', attributes: ['nombre_completo'] },
        { model: Mascota, as: 'mascota', attributes: ['nombre'] }
      ]
    });
  },

  async create(data) {
    return await Solicitud.create(data);
  },

  async update(id, data) {
    return await Solicitud.update(data, { where: { id } });
  },

  async delete(id) {
    return await Solicitud.destroy({ where: { id } });
  }
};

module.exports = SolicitudesRepository;