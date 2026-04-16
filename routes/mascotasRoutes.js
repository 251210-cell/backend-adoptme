const express = require('express');
const router = express.Router();
const MascotasController = require('../controllers/mascotasController');
const { mascotaValidations, handleValidationErrors } = require('../utils/validations');
const upload = require('../middlewares/upload'); 

// --- RUTAS DE LECTURA ---
router.get('/', MascotasController.obtenerMascotas);

// NUEVA RUTA DE ESTADÍSTICAS (Debe ir antes de /:id)
router.get('/estadisticas', MascotasController.obtenerEstadisticas);

router.get('/:id', MascotasController.obtenerMascotaPorId);

// --- RUTAS DE ESCRITURA ---
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

// El método debe ser PATCH porque eso es lo que envía tu frontend
router.patch('/:id/estado', MascotasController.actualizarEstadoMascota);

module.exports = router;