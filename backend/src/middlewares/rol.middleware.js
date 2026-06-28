export const verificarRoles = (roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.rol) {
            const error = new Error("No esta autorizado: Faltan credenciales previas");
            error.status(403);
            return next(error);
        }

        if (!roles.includes(req.user.rol)) {
            const error = new Error(`El rol ${req.user.rol} no tiene permiso para acceder a este recurso`);
            error.status = 403;
            return next(error);
        }

        next();
    }
}