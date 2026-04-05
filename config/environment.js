const path = require('path');

// Cargar variables de entorno
require('dotenv').config();

const requiredEnvVars = [
  'PORT',
  'DB_HOST',
  'DB_USER',
  'DB_NAME',
  'JWT_SECRET'
];

const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingVars.length > 0) {
  console.error(' Variables de entorno faltantes:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\nAsegúrate de configurar todas las variables en .env');
  console.error('\nEjemplo de .env:');
  console.error(`PORT=3000
DB_HOST=172.31.65.213    
DB_USER=karla
DB_PASSWORD=12345678
DB_NAME=adopt-me
JWT_SECRET=tu_secreto_super_seguro`);
  process.exit(1);
}

console.log(' Todas las variables de entorno están configuradas');

module.exports = {
  port: process.env.PORT || 3306,
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '24h'
  },
  api: {
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutos
      maxRequests: 100 // 100 requests
    }
  }
};
