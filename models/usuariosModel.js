const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  contrasena: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rol: {
    type: DataTypes.STRING,
    defaultValue: 'usuario'
  },
  nombre_usuario: DataTypes.STRING,
  foto_perfil: DataTypes.STRING,
  telefono: DataTypes.STRING,
  direccion: DataTypes.STRING,
  ciudad: DataTypes.STRING,
  biografia: DataTypes.TEXT,
  tipo_vivienda: DataTypes.STRING,
  tiene_patio: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  tiene_otras_mascotas: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  experiencia_mascotas: DataTypes.STRING
}, {
  tableName: 'usuarios',
  timestamps: false,
  hooks: {
    beforeCreate: (usuario) => {
      if (usuario.email) {
        const emailLower = usuario.email.trim().toLowerCase();
        usuario.rol = emailLower.endsWith('@adopt-me.com') ? 'admin' : 'usuario';
      }
    },
    beforeUpdate: (usuario) => {
      if (usuario.email) {
        const emailLower = usuario.email.trim().toLowerCase();
        usuario.rol = emailLower.endsWith('@adopt-me.com') ? 'admin' : 'usuario';
      }
    }
  }
});

module.exports = Usuario;