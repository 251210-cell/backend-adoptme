const CitasService = require('../services/citasService');

const CitasController = {
  async obtenerCitas(req, res) {
    try {
      const citas = await CitasService.obtenerCitas();
      res.json(citas);
    } catch (error) {
      console.error('Error en obtenerCitas:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerCitaPorId(req, res) {
    try {
      const cita = await CitasService.obtenerCitaPorId(req.params.id);
      if (!cita) {
        return res.status(404).json({ error: 'Cita no encontrada' });
      }
      res.json(cita);
    } catch (error) {
      console.error('Error en obtenerCitaPorId:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async crearCita(req, res) {
    try {
      console.log('Datos recibidos:', req.body);
      const nuevaCita = await CitasService.crearCita(req.body);
      res.status(201).json(nuevaCita);
    } catch (error) {
      console.error('Error en crearCita:', error);
      res.status(500).json({ error: error.message, details: error.errors || [] });
    }
  },

  async actualizarCita(req, res) {
    try {
      const citaActualizada = await CitasService.actualizarCita(req.params.id, req.body);
      if (!citaActualizada[0]) {
        return res.status(404).json({ error: 'Cita no encontrada' });
      }
      res.json({ message: 'Cita actualizada correctamente' });
    } catch (error) {
      console.error('Error en actualizarCita:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async eliminarCita(req, res) {
    try {
      const eliminado = await CitasService.eliminarCita(req.params.id);
      if (!eliminado) {
        return res.status(404).json({ error: 'Cita no encontrada' });
      }
      res.json({ message: 'Cita eliminada correctamente' });
    } catch (error) {
      console.error('Error en eliminarCita:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = CitasController;