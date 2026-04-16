const Solicitud = require('../models/solicitudesModel');
const Usuario = require('../models/usuariosModel');
const Mascota = require('../models/mascotasModel');
const Mensaje = require('../models/mensajesModel'); // Importamos tu modelo de Mensaje
const sequelize = require('../config/db');

const SolicitudesRepository = {
    async findAll() {
        return await Solicitud.findAll({
            include: [
                { model: Usuario, as: 'usuario', attributes: ['id', 'nombre_usuario', 'email'] },
                { model: Mascota, as: 'mascota', attributes: ['nombre', 'id'] }
            ],
            order: [['id', 'DESC']]
        });
    },

    // --- FUNCIÓN ACTUALIZADA CON LÓGICA DE MENSAJERÍA ---
    async updateStatus(id, nuevoEstado, idMascota, idUsuarioDestino, mensajeTexto, idAdmin) {
        const t = await sequelize.transaction();

        try {
            // 1. Actualizar la Solicitud
            await Solicitud.update(
                { estado: nuevoEstado }, 
                { where: { id }, transaction: t }
            );

            // 2. Actualizar la Mascota
            if (idMascota) {
                const mEstado = nuevoEstado === 'Aprobada' ? 'Adoptado' : 'Disponible';
                await Mascota.update(
                    { estado: mEstado }, 
                    { where: { id: idMascota }, transaction: t }
                );
            }

            // 3. Crear el Mensaje automático en la tabla 'mensajes'
            // Usamos los campos de TU modelo: id_remitente, id_destinatario, id_mascota, contenido
            if (mensajeTexto || nuevoEstado) {
                const contenidoFinal = mensajeTexto || `Tu solicitud para adoptar a la mascota ha sido ${nuevoEstado}.`;
                
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
            console.error("Error en updateStatus con Mensaje:", error.message);
            throw error;
        }
    }
};

module.exports = SolicitudesRepository;