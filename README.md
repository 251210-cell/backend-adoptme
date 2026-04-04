# AdoptMeBack

API REST para adopción de mascotas, construida con Node.js, Express y MySQL.

## Instalación

1. Clona el repositorio.
2. Ejecuta `npm install` para instalar dependencias.
3. Configura las variables de entorno en `.env` (copia de `.env.example` si existe).
4. Inicia MySQL y crea la base de datos con `schema.sql`.
5. Ejecuta `npm start` para iniciar el servidor.

## Uso

- Servidor en `http://localhost:3000`.
- Endpoints principales:
  - `/api/usuarios`
  - `/api/mascotas`
  - `/api/solicitudes`
  - `/api/citas`
  - `/api/mensajes`

## Tests

Ejecuta `npm test` para correr pruebas con Jest.

## Tecnologías

- Node.js
- Express
- MySQL
- Sequelize
- Socket.io