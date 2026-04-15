const MascotasService = require('../services/mascotasService');
const { getIO } = require('../websockets/socket');

const MascotasController = {
  
  async obtenerMascotas(req, res) {
    try {
      const mascotas = await MascotasService.obtenerMascotas();
      res.json(mascotas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerMascotaPorId(req, res) {
    try {
      const mascota = await MascotasService.obtenerMascotaPorId(req.params.id);
      if (!mascota) return res.status(404).json({ error: 'Mascota no encontrada' });
      res.json(mascota);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerEstadisticas(req, res) {
    try {
      const mascotas = await MascotasService.obtenerMascotas();
      const total = mascotas.length;
      
      const porEstado = mascotas.reduce((acc, pet) => {
        const key = pet.estado ? pet.estado.toLowerCase() : 'disponible';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      res.json({
        total,
        porEstado
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async crearMascota(req, res) {
    try {
      const imagenUrl = req.file ? req.file.path : null;
      
      const { 
        nombre, raza, edad, refugio, tamano, 
        estado_salud, condicion_especial, descripcion 
      } = req.body;

      // ✅ MODIFICACIÓN: Forzamos el estado a 'disponible' 
      // y aseguramos la condicion_especial
      const datosFinales = { 
        nombre, 
        raza, 
        edad, 
        refugio, 
        tamano, 
        estado_salud, 
        condicion_especial: condicion_especial || 'Ninguna', 
        descripcion,
        estado: 'disponible', // <--- Ya no depende del req.body
        imagen: imagenUrl 
      };

      const nuevaMascota = await MascotasService.crearMascota(datosFinales);
      
      const io = getIO();
      const creador_email = req.user?.email || 'anónimo';
      io.emit('mascota_creada', { ...nuevaMascota.toJSON(), creador_email, timestamp: new Date() });
      
      res.status(201).json(nuevaMascota);
    } catch (error) {
      console.error("Error al crear:", error.message);
      res.status(500).json({ error: error.message });
    }
  },

  async actualizarMascota(req, res) {
    try {
      const imagenUrl = req.file ? req.file.path : null;
      let datosActualizar = { ...req.body };
      
      if (imagenUrl) {
        datosActualizar.imagen = imagenUrl;
      }

      const mascotaActualizada = await MascotasService.actualizarMascota(req.params.id, datosActualizar);
      
      if (!mascotaActualizada) return res.status(404).json({ error: 'No encontrada' });
      
      const io = getIO();
      io.emit('mascota_actualizada', { id: req.params.id, cambios: datosActualizar, timestamp: new Date() });
      
      res.json({ message: 'Mascota actualizada correctamente' });
    } catch (error) {
      console.error("Error al actualizar:", error.message);
      res.status(500).json({ error: error.message });
    }
  },

  async eliminarMascota(req, res) {
    try {
      await MascotasService.eliminarMascota(req.params.id);
      const io = getIO();
      io.emit('mascota_eliminada', { id: req.params.id, timestamp: new Date() });
      res.json({ message: 'Mascota eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = MascotasController;