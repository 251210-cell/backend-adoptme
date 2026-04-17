const express = require('express');
const router = express.Router();
const MascotasController = require('../controllers/mascotasController');
const { mascotaValidations, handleValidationErrors } = require('../utils/validations');
const upload = require('../middlewares/upload'); 


router.get('/', MascotasController.obtenerMascotas);


router.get('/estadisticas', MascotasController.obtenerEstadisticas);

router.get('/:id', MascotasController.obtenerMascotaPorId);


router.post('/', 
    upload.single('imagen'), 
    mascotaValidations.crearMascota, 
    handleValidationErrors, 
    MascotasController.crearMascota
);

router.put('/:id', 
    upload.single('imagen'), 
    mascotaValidations.crearMascota, 
    handleValidationErrors, 
    MascotasController.actualizarMascota
);

router.delete('/:id', MascotasController.eliminarMascota);


router.patch('/:id/estado', MascotasController.actualizarEstadoMascota);

module.exports = router;