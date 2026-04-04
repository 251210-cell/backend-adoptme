const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Mensaje = sequelize.define('Mensaje', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_remitente: DataTypes.INTEGER,
  id_destinatario: DataTypes.INTEGER,
  id_mascota: DataTypes.INTEGER,
  contenido: DataTypes.TEXT,
  leido: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  fecha_envio: DataTypes.DATE
}, {
  tableName: 'mensajes',
  timestamps: false
});

module.exports = Mensaje;