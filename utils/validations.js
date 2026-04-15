const { body, param, validationResult } = require('express-validator');

// 1. Definición de Reglas de Validación
const usuarioValidations = {
  crearUsuario: [
    body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
    body('contrasena').isLength({ min: 6 }).withMessage('Contraseña mínimo 6 caracteres'),
    body('nombre_usuario').isLength({ min: 3 }).withMessage('Nombre de usuario mínimo 3 caracteres'),
    body('telefono').optional().isMobilePhone().withMessage('Teléfono inválido'),
    body('ciudad').optional().isString().withMessage('Ciudad inválida')
  ],
  
  actualizarUsuario: [
    body('email').optional().isEmail().normalizeEmail().withMessage('Email inválido'),
    body('contrasena').optional().isLength({ min: 6 }).withMessage('Contraseña mínimo 6 caracteres'),
    body('ciudad').optional().isString().withMessage('Ciudad inválida')
  ],

  login: [
    body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
    body('contrasena').notEmpty().withMessage('Contraseña requerida')
  ]
};

const mascotaValidations = {
  crearMascota: [
    body('nombre').isLength({ min: 2 }).withMessage('Nombre mínimo 2 caracteres'),
    body('raza').notEmpty().withMessage('Raza requerida'),
    body('edad').notEmpty().withMessage('Edad requerida'),
    body('tamano').isIn(['Pequeno', 'Mediano', 'Grande']).withMessage('Tamaño inválido'),
    body('estado_salud').isLength({ min: 2 }).withMessage('Estado de salud requerido'),
    body('descripcion').isLength({ min: 10 }).withMessage('Descripción mínimo 10 caracteres'),
    body('condicion_especial').optional().isString().withMessage('Condición especial debe ser texto')
  ]
};

const solicitudValidations = {
  crearSolicitud: [
    body('id_usuario').isInt().withMessage('ID usuario inválido'),
    body('id_mascota').isInt().withMessage('ID mascota inválido'),
    body('ocupacion').notEmpty().withMessage('Ocupación requerida'),
    body('edad_usuario').isInt({ min: 0 }).withMessage('Edad inválida'),
    body('motivo_adopcion').isLength({ min: 10 }).withMessage('Motivo mínimo 10 caracteres')
  ]
};

const citaValidations = {
  crearCita: [
    body('id_usuario').isInt().withMessage('ID usuario inválido'),
    body('id_mascota').isInt().withMessage('ID mascota inválido'),
    body('fecha_visita').isISO8601().withMessage('Fecha inválida'),
    body('hora_visita').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]/).withMessage('Hora inválida')
  ]
};

const mensajeValidations = {
  crearMensaje: [
    body('id_remitente').isInt().withMessage('ID remitente inválido'),
    body('id_destinatario').isInt().withMessage('ID destinatario inválido'),
    body('contenido').isLength({ min: 1, max: 5000 }).withMessage('Contenido inválido')
  ]
};

// 2. Middleware para procesar los resultados de las validaciones de arriba
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Datos inválidos',
      // Usamos path (estándar nuevo) o param (estándar viejo) para asegurar compatibilidad
      details: errors.array().map(err => ({ 
        field: err.path || err.param, 
        message: err.msg 
      }))
    });
  }
  next();
};

// 3. Exportación de todo el módulo
module.exports = {
  usuarioValidations,
  mascotaValidations,
  solicitudValidations,
  citaValidations,
  mensajeValidations,
  handleValidationErrors
};