const Nosotros = require('../models/Nosotros');

const obtenerNosotros = async (req, res) => {
    try {
        const info = await Nosotros.findOne({ where: { id: 1 } });
        res.json(info || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const actualizarNosotros = async (req, res) => {
    try {
        // upsert inserta si no existe el ID 1, o actualiza si ya existe
        await Nosotros.upsert({
            id: 1,
            ...req.body
        });
        res.json({ message: "Información actualizada correctamente" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { obtenerNosotros, actualizarNosotros };