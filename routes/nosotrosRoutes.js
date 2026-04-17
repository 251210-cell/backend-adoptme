const express = require('express');
const router = express.Router();
const { obtenerNosotros, actualizarNosotros } = require('../controllers/nosotrosController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', obtenerNosotros);
router.post('/', authMiddleware, actualizarNosotros);

module.exports = router;