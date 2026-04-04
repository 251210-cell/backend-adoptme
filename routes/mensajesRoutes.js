const express = require('express');
const router = express.Router();
const MensajesController = require('../controllers/mensajesController');
const { mensajeValidations, handleValidationErrors } = require('../utils/validations');

router.get('/', MensajesController.obtenerMensajes);
router.get('/:id', MensajesController.obtenerMensajePorId);
router.post('/', mensajeValidations.crearMensaje, handleValidationErrors, MensajesController.crearMensaje);
router.put('/:id', mensajeValidations.crearMensaje, handleValidationErrors, MensajesController.actualizarMensaje);
router.delete('/:id', MensajesController.eliminarMensaje);

module.exports = router;