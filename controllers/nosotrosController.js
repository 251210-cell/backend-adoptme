const Nosotros = require('../models/Nosotros');

const NosotrosController = {
    async obtenerNosotros(req, res) {
        try {
            const info = await Nosotros.findOne({ where: { id: 1 } });
            res.json(info || {});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async actualizarNosotros(req, res) {
        try {
           
            const [info] = await Nosotros.upsert({
                id: 1,
                ...req.body
            });
            res.json({ message: "Información guardada en la nube", data: info });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = NosotrosController;