const express = require('express');
const router = express.Router();
const SolicitudesController = require('../controllers/solicitudesController');

// Rutas de Solicitudes
router.get('/', SolicitudesController.obtenerSolicitudes);
router.get('/:id', SolicitudesController.obtenerSolicitudPorId);
router.post('/', SolicitudesController.crearSolicitud);

// Esta es la ruta que procesa la aprobación/rechazo
router.put('/:id', SolicitudesController.actualizarSolicitud);

router.delete('/:id', SolicitudesController.eliminarSolicitud);

module.exports = router;