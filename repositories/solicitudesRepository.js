const Solicitud = require('../models/solicitudesModel');
const Usuario = require('../models/usuariosModel');
const Mascota = require('../models/mascotasModel');
const Mensaje = require('../models/mensajesModel'); 
const sequelize = require('../config/db');

const SolicitudesRepository = {
    // --- NUEVA FUNCIÓN PARA CREAR (La que te faltaba) ---
    async create(datos) {
        try {
            // Ajusta los nombres de los campos según tu modelo 'Solicitud'
            return await Solicitud.create({
                id_usuario: datos.id_usuario, // Asegúrate que el frontend mande estos IDs
                id_mascota: datos.id_mascota,
                nombre_completo: datos.nombre_completo,
                edad: datos.edad,
                ocupacion: datos.ocupacion,
                estado: datos.estado_solicitud || 'Pendiente',
                fecha_solicitud: new Date()
            });
        } catch (error) {
            console.error("Error en SolicitudesRepository.create:", error.message);
            throw error;
        }
    },

    async findAll() {
        return await Solicitud.findAll({
            include: [
                { model: Usuario, as: 'usuario', attributes: ['id', 'nombre_usuario', 'email'] },
                { model: Mascota, as: 'mascota', attributes: ['nombre', 'id'] }
            ],
            order: [['id', 'DESC']]
        });
    },

    async updateStatus(id, nuevoEstado, idMascota, idUsuarioDestino, mensajeTexto, idAdmin) {
        const t = await sequelize.transaction();
        try {
            await Solicitud.update(
                { estado: nuevoEstado }, 
                { where: { id }, transaction: t }
            );

            if (idMascota) {
                const mEstado = nuevoEstado === 'Aprobada' ? 'Adoptado' : 'Disponible';
                await Mascota.update(
                    { estado: mEstado }, 
                    { where: { id: idMascota }, transaction: t }
                );
            }

            if (mensajeTexto || nuevoEstado) {
                const contenidoFinal = mensajeTexto || `Tu solicitud ha sido ${nuevoEstado}.`;
                
                await Mensaje.create({
                    id_remitente: idAdmin,
                    id_destinatario: idUsuarioDestino,
                    id_mascota: idMascota,
                    contenido: contenidoFinal,
                    fecha_envio: new Date()
                }, { transaction: t });
            }

            await t.commit();
            return true;
        } catch (error) {
            await t.rollback();
            console.error("Error en updateStatus:", error.message);
            throw error;
        }
    }
};

module.exports = SolicitudesRepository;