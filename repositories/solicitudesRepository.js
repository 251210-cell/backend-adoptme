const Solicitud = require('../models/solicitudesModel');
const Usuario = require('../models/usuariosModel');
const Mascota = require('../models/mascotasModel');
const sequelize = require('../config/db');

const SolicitudesRepository = {
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

    async create(data) {
        try {
            return await Solicitud.create(data);
        } catch (error) {
            console.error("Error al crear solicitud:", error.message);
            throw error;
        }
    },

    async updateStatus(id, nuevoEstado, idMascota) {
        const t = await sequelize.transaction();

        try {
            // 1. Actualizar la Solicitud
            await Solicitud.update(
                { estado_solicitud: nuevoEstado }, 
                { where: { id }, transaction: t }
            );

            // 2. Actualizar la Mascota si tenemos el ID
            if (idMascota) {
                const mEstado = nuevoEstado.toLowerCase() === 'aprobada' ? 'Adoptado' : 'Disponible';
                
                await Mascota.update(
                    { estado: mEstado }, 
                    { where: { id: idMascota }, transaction: t }
                );
                console.log(`Log: Mascota ${idMascota} actualizada a ${mEstado}`);
            }

            await t.commit();
            return true;
        } catch (error) {
            await t.rollback();
            console.error("Error en updateStatus Repository:", error.message);
            throw error;
        }
    }
};

module.exports = SolicitudesRepository;