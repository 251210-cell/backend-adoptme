const Solicitud = require('../models/solicitudesModel');
const Usuario = require('../models/usuariosModel');
const Mascota = require('../models/mascotasModel');
const Mensaje = require('../models/mensajesModel'); 
const sequelize = require('../config/db');

const SolicitudesRepository = {
   
    async create(datos) {
        try {
            // Sequelize necesita que los nombres aquí coincidan EXACTAMENTE 
            // con los nombres definidos en tu modelo (solicitudesModel.js)
            return await Solicitud.create({
                id_usuario: datos.id_usuario, 
                id_mascota: datos.id_mascota,
                ocupacion: datos.ocupacion,
                edad_usuario: datos.edad_usuario || datos.edad, // Acepta ambos por si acaso
                motivo_adopcion: datos.motivo_adopcion,
                tiene_mascotas_actuales: datos.tiene_mascotas_actuales,
                permiso_casero: datos.permiso_casero,
                espacio_suficiente: datos.espacio_suficiente,
                estado: datos.estado || 'Pendiente',
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