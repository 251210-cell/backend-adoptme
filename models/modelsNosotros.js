const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Nosotros = sequelize.define('Nosotros', {
   
    tituloPrincipal: { type: DataTypes.STRING, defaultValue: 'Nosotros' },
    subtitulo: { type: DataTypes.STRING, defaultValue: 'Fundación Adopt-Me' },
    parrafo1: { type: DataTypes.TEXT },
    parrafo2: { type: DataTypes.TEXT },
    imagenIntro: { type: DataTypes.TEXT }, 
    
   
    tituloObjetivo: { type: DataTypes.STRING, defaultValue: 'Nuestro Objetivo' },
    objetivo1: { type: DataTypes.TEXT },
    objetivo2: { type: DataTypes.TEXT },
    objetivo3: { type: DataTypes.TEXT },
    
   
    tituloEquipo: { type: DataTypes.STRING, defaultValue: 'Nuestro equipo' },
    miembrosEquipo: { 
        type: DataTypes.JSON, 
        defaultValue: []
    }
}, {
    tableName: 'nosotros_info',
    timestamps: false
});

module.exports = Nosotros;