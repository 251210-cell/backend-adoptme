const Nosotros = require('../models/Nosotros');

const NosotrosController = {
    // Obtener datos para mostrar en la web y en el admin
    async obtenerNosotros(req, res) {
        try {
            const info = await Nosotros.findOne({ where: { id: 1 } });
            res.json(info || {});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Guardar o actualizar datos
    async actualizarNosotros(req, res) {
        try {
            // Buscamos el registro 1, si no existe lo crea, si existe lo actualiza
            const [info, created] = await Nosotros.upsert({
                id: 1,
                ...req.body
            });
            res.json({ message: "Información actualizada correctamente", data: info });
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = NosotrosController;