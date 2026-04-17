const UsuariosService = require('../services/usuariosService');

const UsuariosController = {
  async obtenerUsuarios(req, res) {
    try {
      const usuarios = await UsuariosService.obtenerUsuarios();
      res.json(usuarios);
    } catch (error) {
      console.error('Error en obtenerUsuarios:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerUsuarioPorId(req, res) {
    try {
      const usuario = await UsuariosService.obtenerUsuarioPorId(req.params.id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(usuario);
    } catch (error) {
      console.error('Error en obtenerUsuarioPorId:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async crearUsuario(req, res) {
    try {
      console.log('Datos recibidos:', req.body);
      const nuevoUsuario = await UsuariosService.crearUsuario(req.body);
      res.status(201).json(nuevoUsuario);
    } catch (error) {
      console.error('Error en crearUsuario:', error);
      res.status(500).json({ error: error.message, details: error.errors || [] });
    }
  },

 


 async actualizarUsuario(req, res) {
  try {
    
      await UsuariosService.actualizarUsuario(req.params.id, req.body);
      
      
      res.json({ 
          message: 'Usuario actualizado correctamente',
          data: req.body 
      });
  } catch (error) {
      console.error('Error en actualizarUsuario:', error);
      res.status(400).json({ error: error.message });
  }
},



  async eliminarUsuario(req, res) {
    try {
      const eliminado = await UsuariosService.eliminarUsuario(req.params.id);
      if (!eliminado) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      console.error('Error en eliminarUsuario:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async loginUsuario(req, res) {
    try {
      const { email, contrasena } = req.body;
      
      if (!email || !contrasena) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
      }

      const resultado = await UsuariosService.loginUsuario(email, contrasena);
      res.json(resultado);
    } catch (error) {
      console.error('Error en loginUsuario:', error);
      res.status(401).json({ error: error.message });
    }
  }
};

module.exports = UsuariosController;