const express = require('express');
const router = express.Router();
const UsuariosController = require('../controllers/usuariosController');
const { usuarioValidations, handleValidationErrors } = require('../utils/validations');

// Rutas públicas
router.post('/login', usuarioValidations.login, handleValidationErrors, UsuariosController.loginUsuario);
router.post('/', usuarioValidations.crearUsuario, handleValidationErrors, UsuariosController.crearUsuario);

// Rutas abiertas (sin auth)
router.get('/', UsuariosController.obtenerUsuarios);
router.get('/:id', UsuariosController.obtenerUsuarioPorId);
router.put('/:id', usuarioValidations.actualizarUsuario, handleValidationErrors, UsuariosController.actualizarUsuario);
router.delete('/:id', UsuariosController.eliminarUsuario);

module.exports = router;