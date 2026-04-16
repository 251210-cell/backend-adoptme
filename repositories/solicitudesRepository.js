const Solicitud = require('../models/solicitudesModel');
const Usuario = require('../models/usuariosModel');
const Mascota = require('../models/mascotasModel');
const sequelize = require('../config/db');

const SolicitudesRepository = {
    async findAll() {
        return await Solicitud.findAll({
            include: [
                { model: Usuario, as: 'usuario', attributes: ['nombre_usuario', 'email'] },
                { model: Mascota, as: 'mascota', attributes: ['nombre', 'id'] }
            ],
            order: [['id', 'DESC']]
        });
    },

    async updateStatus(id, nuevoEstado, idMascota) {
        const t = await sequelize.transaction();
        try {
            // 1. Actualizar Solicitud (Usando el nombre exacto del modelo: 'estado')
            await Solicitud.update(
                { estado: nuevoEstado }, 
                { where: { id }, transaction: t }
            );

            // 2. Actualizar Mascota
            if (idMascota) {
                const mEstado = nuevoEstado.toLowerCase() === 'aprobada' ? 'Adoptado' : 'Disponible';
                await Mascota.update(
                    { estado: mEstado }, 
                    { where: { id: idMascota }, transaction: t }
                );
                console.log(`Log: Mascota ${idMascota} ahora está ${mEstado}`);
            }

            await t.commit();
            return true;
        } catch (error) {
            await t.rollback();
            console.error("Error en Repository:", error.message);
            throw error;
        }
    }
};

module.exports = SolicitudesRepository;