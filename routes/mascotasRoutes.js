const express = require('express');
const router = express.Router();
const MascotasController = require('../controllers/mascotasController');
const { mascotaValidations, handleValidationErrors } = require('../utils/validations');

router.get('/', MascotasController.obtenerMascotas);
router.get('/:id', MascotasController.obtenerMascotaPorId);
router.post('/', mascotaValidations.crearMascota, handleValidationErrors, MascotasController.crearMascota);
router.put('/:id', mascotaValidations.crearMascota, handleValidationErrors, MascotasController.actualizarMascota);
router.delete('/:id', MascotasController.eliminarMascota);

module.exports = router;