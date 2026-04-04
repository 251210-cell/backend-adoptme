const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Mascota = sequelize.define('Mascota', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: DataTypes.STRING,
  raza: DataTypes.STRING,
  edad: DataTypes.STRING,
  refugio: DataTypes.STRING,
  tamano: DataTypes.STRING,
  estado_salud: DataTypes.STRING,
  condicion_especial: DataTypes.STRING,
  descripcion: DataTypes.TEXT,
  imagen: DataTypes.STRING,
  estado: {
    type: DataTypes.STRING,
    defaultValue: 'DISPONIBLE'
  },
  fecha_publicacion: DataTypes.DATE
}, {
  tableName: 'mascotas',
  timestamps: false,
  hooks: {
    beforeCreate: (mascota) => {
      if (!mascota.fecha_publicacion) {
        mascota.fecha_publicacion = new Date();
      }
    }
  }
});

module.exports = Mascota;