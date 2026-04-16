const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Solicitud = sequelize.define('Solicitud', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false // En tu DB es NOT NULL
  },
  id_mascota: {
    type: DataTypes.INTEGER,
    allowNull: false // En tu DB es NOT NULL
  },
  ocupacion: {
    type: DataTypes.STRING(100) // Coincide con varchar(100)
  },
  edad_usuario: {
    type: DataTypes.INTEGER
  },
  motivo_adopcion: {
    type: DataTypes.TEXT
  },
  tiene_mascotas_actuales: {
    // Usamos ENUM para que coincida con tu base de datos
    type: DataTypes.ENUM('Si', 'No') 
  },
  permiso_casero: {
    type: DataTypes.TEXT
  },
  espacio_suficiente: {
    type: DataTypes.TEXT
  },
  estado: {
    // Ajustamos los valores del ENUM según tu DESCRIBE
    type: DataTypes.ENUM('En Revisión', 'Aprobada', 'Rechazada'),
    defaultValue: 'En Revisión'
  },
  fecha_solicitud: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW // Para que AWS lo genere automáticamente
  }
}, {
  tableName: 'solicitudes',
  timestamps: false
});

module.exports = Solicitud;