const roleMiddleware = (rolesPermitidos = []) => {
  return (req, res, next) => {
    const usuario = req.user;

    if (!usuario) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(usuario.rol)) {
      return res.status(403).json({ 
        error: 'No tienes permiso para acceder a este recurso',
        rol_requerido: rolesPermitidos
      });
    }

    next();
  };
};

module.exports = roleMiddleware;
