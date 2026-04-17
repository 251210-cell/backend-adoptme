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
    
    const usuarioExistente = await UsuariosRepository.findByEmail(data.email);
    if (usuarioExistente) {
      throw new Error('El email ya está registrado');
    }

    
    const salt = await bcrypt.genSalt(10);
    const contrasenaHasheada = await bcrypt.hash(data.contrasena, salt);

    
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
   
    if (data.contrasena) {
      const salt = await bcrypt.genSalt(10);
      data.contrasena = await bcrypt.hash(data.contrasena, salt);
    }

   
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

   
    const esValida = await bcrypt.compare(contrasena, usuario.contrasena);
    
    if (!esValida) {
      throw new Error('Credenciales inválidas');
    }

   
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