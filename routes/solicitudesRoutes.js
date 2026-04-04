const express = require('express');
const router = express.Router();
const SolicitudesController = require('../controllers/solicitudesController');
const { solicitudValidations, handleValidationErrors } = require('../utils/validations');

router.get('/', SolicitudesController.obtenerSolicitudes);
router.get('/:id', SolicitudesController.obtenerSolicitudPorId);
router.post('/', solicitudValidations.crearSolicitud, handleValidationErrors, SolicitudesController.crearSolicitud);
router.put('/:id', solicitudValidations.crearSolicitud, handleValidationErrors, SolicitudesController.actualizarSolicitud);
router.delete('/:id', SolicitudesController.eliminarSolicitud);

module.exports = router;