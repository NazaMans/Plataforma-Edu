import * as authService from "./auth.service.js";

export const register = async (req, res, next) => {
    try {
        const nuevoUsuario = await authService.registrarUsuario(req.body);
        res.json({
            succes: true, 
            message: "Usuario registrado de manera exitosa",
            usuario: nuevoUsuario
        });
    } catch (error) {
        console.log("Datos que llegan: (Error)", req.body);
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const resultado = await authService.loginUsuario(req.body);
        res.json({
            success: true,
            message: "Logeado exitosamente",
            ...resultado
        });
    } catch (error) {
        next(error);
    }
};