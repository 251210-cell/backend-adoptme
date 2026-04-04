const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Solicitud = sequelize.define('Solicitud', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_usuario: DataTypes.INTEGER,
  id_mascota: DataTypes.INTEGER,
  ocupacion: DataTypes.STRING,
  edad_usuario: DataTypes.INTEGER,
  motivo_adopcion: DataTypes.TEXT,
  tiene_mascotas_actuales: DataTypes.STRING,
  permiso_casero: DataTypes.STRING,
  espacio_suficiente: DataTypes.STRING,
  estado: {
    type: DataTypes.STRING,
    defaultValue: 'PENDIENTE'
  },
  fecha_solicitud: DataTypes.DATE
}, {
  tableName: 'solicitudes',
  timestamps: false
});

module.exports = Solicitud;