const sequelize = require('./config/db');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos exitosa');
    console.log(`Base de datos: ${process.env.DB_NAME}`);
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`Usuario: ${process.env.DB_USER}`);
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error.message);
  } finally {
    await sequelize.close();
  }
}

testConnection();