const UsuariosRepository = require('../repositories/usuariosRepository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const UsuariosService = {
  async obtenerUsuarios() {
    return await UsuariosRepository.findAll();
  },

  async obtenerUsuarioPorId(id) {
    return await UsuariosRepository.findById(id);
  },

  async crearUsuario(data) {
    // Verificar si el usuario ya existe
    const usuarioExistente = await UsuariosRepository.findByEmail(data.email);
    if (usuarioExistente) {
      throw new Error('El email ya está registrado');
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const contrasenaHasheada = await bcrypt.hash(data.contrasena, salt);

    // Asignar rol según dominio de correo
    const emailLower = data.email.trim().toLowerCase();
    const rol = emailLower.endsWith('@adopt-me.com') ? 'admin' : 'usuario';

    const usuarioData = {
      ...data,
      contrasena: contrasenaHasheada,
      rol
    };

    return await UsuariosRepository.create(usuarioData);
  },

  async actualizarUsuario(id, data) {
    // Si envía contraseña nueva, hashearla
    if (data.contrasena) {
      const salt = await bcrypt.genSalt(10);
      data.contrasena = await bcrypt.hash(data.contrasena, salt);
    }

    // Si actualiza el email, recalcular rol por dominio
    if (data.email) {
      const emailLower = data.email.trim().toLowerCase();
      data.rol = emailLower.endsWith('@adopt-me.com') ? 'admin' : 'usuario';
    }

    return await UsuariosRepository.update(id, data);
  },

  async eliminarUsuario(id) {
    return await UsuariosRepository.delete(id);
  },

  async loginUsuario(email, contrasena) {
    const usuario = await UsuariosRepository.findByEmail(email);
    
    if (!usuario) {
      throw new Error('Credenciales inválidas');
    }

    // Comparar contraseña hasheada
    const esValida = await bcrypt.compare(contrasena, usuario.contrasena);
    
    if (!esValida) {
      throw new Error('Credenciales inválidas');
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET || 'tu_secret_key',
      { expiresIn: '24h' }
    );

    return {
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre_usuario: usuario.nombre_usuario,
        rol: usuario.rol
      }
    };
  }
};

module.exports = UsuariosService;