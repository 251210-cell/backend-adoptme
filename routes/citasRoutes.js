const express = require('express');
const router = express.Router();
const CitasController = require('../controllers/citasController');
const { citaValidations, handleValidationErrors } = require('../utils/validations');

router.get('/', CitasController.obtenerCitas);
router.get('/:id', CitasController.obtenerCitaPorId);
router.post('/', citaValidations.crearCita, handleValidationErrors, CitasController.crearCita);
router.put('/:id', citaValidations.crearCita, handleValidationErrors, CitasController.actualizarCita);
router.delete('/:id', CitasController.eliminarCita);

module.exports = router;