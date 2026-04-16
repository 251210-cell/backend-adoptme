const Solicitud = require('../models/solicitudesModel');
const Usuario = require('../models/usuariosModel');
const Mascota = require('../models/mascotasModel');
const sequelize = require('../config/db');

const SolicitudesRepository = {
    // Para listar en el Panel Admin
    async findAll() {
        try {
            return await Solicitud.findAll({
                include: [
                    { model: Usuario, as: 'usuario', attributes: ['nombre_usuario', 'email'] },
                    { model: Mascota, as: 'mascota', attributes: ['nombre', 'id'] }
                ],
                order: [['id', 'DESC']]
            });
        } catch (error) {
            console.error("Error en findAll:", error.message);
            throw error;
        }
    },

    // ESTA ES LA FUNCIÓN QUE TE FALTABA PARA EL FORMULARIO
    async create(data) {
        try {
            return await Solicitud.create(data);
        } catch (error) {
            console.error("Error al crear solicitud:", error.message);
            throw error;
        }
    },

    // Para Aprobar/Rechazar
    async updateStatus(id, nuevoEstado, idMascota) {
        try {
            // 1. Actualizar Solicitud
            await Solicitud.update({ estado: nuevoEstado }, { where: { id } });

            // 2. Intentar actualizar mascota (si falla no detiene el proceso)
            if (idMascota) {
                try {
                    const mEstado = nuevoEstado === 'Aprobada' ? 'Adoptado' : 'Disponible';
                    await Mascota.update({ estado: mEstado }, { where: { id: idMascota } });
                } catch (e) {
                    console.error("Error visual en mascota:", e.message);
                }
            }
            return true;
        } catch (error) {
            console.error("Error en updateStatus:", error.message);
            throw error;
        }
    }
};

module.exports = SolicitudesRepository;