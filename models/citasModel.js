const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Cita = sequelize.define('Cita', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_usuario: DataTypes.INTEGER,
  id_mascota: DataTypes.INTEGER,
  fecha_visita: DataTypes.DATE,
  hora_visita: DataTypes.TIME,
  notas_adicionales: DataTypes.TEXT,
  estado: {
    type: DataTypes.STRING,
    defaultValue: 'PROGRAMADA'
  }
}, {
  tableName: 'citas',
  timestamps: false
});

module.exports = Cita;