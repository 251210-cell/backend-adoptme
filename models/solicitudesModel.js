const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Usuario = require('./usuariosModel');
const Mascota = require('./mascotasModel');

const Solicitud = sequelize.define('Solicitud', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_mascota: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ocupacion: { type: DataTypes.STRING(100) },
  edad_usuario: { type: DataTypes.INTEGER },
  motivo_adopcion: { type: DataTypes.TEXT },
  tiene_mascotas_actuales: { type: DataTypes.ENUM('Si', 'No') },
  permiso_casero: { type: DataTypes.TEXT },
  espacio_suficiente: { type: DataTypes.TEXT },
  estado: {
    // Aceptamos 'En Revisión' solo por compatibilidad con tus datos actuales
    type: DataTypes.ENUM('Pendiente', 'Aprobada', 'Rechazada', 'En Revisión'), 
    defaultValue: 'Pendiente'
  },
  fecha_solicitud: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'solicitudes',
  timestamps: false
});

// Asociaciones vitales para ver quién solicita y qué mascota es
Solicitud.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
Solicitud.belongsTo(Mascota, { foreignKey: 'id_mascota', as: 'mascota' });

module.exports = Solicitud;