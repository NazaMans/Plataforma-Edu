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
        const {usuario, token} = await authService.loginUsuario(req.body);

        //guardar token en una cookie
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" || true,
            maxAge: 8 * 60 * 60 * 1000,
            sameSite: "strict"
        });


        res.json({
            success: true,
            message: "Logeado exitosamente",
            usuario
        });
    } catch (error) {
        next(error);
    }
};

//TODO:Implementar logout
export const logout = async (req, res) => {
    res.clearCookie("authToken");
    res.json({succes: true, message: "Sesion cerrada exitosamente"});
};