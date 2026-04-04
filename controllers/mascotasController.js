const MascotasService = require('../services/mascotasService');
const { getIO } = require('../websockets/socket');

const MascotasController = {
  async obtenerMascotas(req, res) {
    try {
      const mascotas = await MascotasService.obtenerMascotas();
      res.json(mascotas);
    } catch (error) {
      console.error('Error en obtenerMascotas:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerMascotaPorId(req, res) {
    try {
      const mascota = await MascotasService.obtenerMascotaPorId(req.params.id);
      if (!mascota) {
        return res.status(404).json({ error: 'Mascota no encontrada' });
      }
      res.json(mascota);
    } catch (error) {
      console.error('Error en obtenerMascotaPorId:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async crearMascota(req, res) {
    try {
      console.log('Datos recibidos:', req.body);
      const nuevaMascota = await MascotasService.crearMascota(req.body);
      
      // Emitir evento WebSocket
      const io = getIO();
      const creador_email = req.user?.email || 'anónimo';
      io.emit('mascota_creada', {
        id: nuevaMascota.id,
        nombre: nuevaMascota.nombre,
        raza: nuevaMascota.raza,
        edad: nuevaMascota.edad,
        tamano: nuevaMascota.tamano,
        estado_salud: nuevaMascota.estado_salud,
        descripcion: nuevaMascota.descripcion,
        refugio: nuevaMascota.refugio,
        creador_email,
        timestamp: new Date()
      });
      
      res.status(201).json(nuevaMascota);
    } catch (error) {
      console.error('Error en crearMascota:', error);
      res.status(500).json({ error: error.message, details: error.errors || [] });
    }
  },

  async actualizarMascota(req, res) {
    try {
      const mascotaActualizada = await MascotasService.actualizarMascota(req.params.id, req.body);
      if (!mascotaActualizada[0]) {
        return res.status(404).json({ error: 'Mascota no encontrada' });
      }
      
      // Emitir evento WebSocket
      const io = getIO();
      const actualizado_por = req.user?.email || 'anónimo';
      io.emit('mascota_actualizada', {
        id: req.params.id,
        cambios: req.body,
        actualizado_por,
        timestamp: new Date()
      });
      
      res.json({ message: 'Mascota actualizada correctamente' });
    } catch (error) {
      console.error('Error en actualizarMascota:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async eliminarMascota(req, res) {
    try {
      const eliminado = await MascotasService.eliminarMascota(req.params.id);
      if (!eliminado) {
        return res.status(404).json({ error: 'Mascota no encontrada' });
      }
      
      // Emitir evento WebSocket
      const io = getIO();
      const eliminado_por = req.user?.email || 'anónimo';
      io.emit('mascota_eliminada', {
        id: req.params.id,
        eliminado_por,
        timestamp: new Date()
      });
      
      res.json({ message: 'Mascota eliminada correctamente' });
    } catch (error) {
      console.error('Error en eliminarMascota:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = MascotasController;