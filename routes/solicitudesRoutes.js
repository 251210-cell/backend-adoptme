const express = require('express');
const router = express.Router();
const SolicitudesController = require('../controllers/solicitudesController');


router.get('/', SolicitudesController.obtenerSolicitudes);
router.get('/:id', SolicitudesController.obtenerSolicitudPorId);
router.post('/', SolicitudesController.crearSolicitud);


router.put('/:id', SolicitudesController.actualizarSolicitud);

router.delete('/:id', SolicitudesController.eliminarSolicitud);

module.exports = router;