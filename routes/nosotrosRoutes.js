const express = require('express');
const router = express.Router();
const NosotrosController = require('../controllers/nosotrosController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', NosotrosController.obtenerNosotros);
router.post('/', authMiddleware, NosotrosController.actualizarNosotros);

module.exports = router;