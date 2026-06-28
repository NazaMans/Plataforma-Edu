import { body, param, query } from "express-validator";
import { verificarValidaciones } from "../../middlewares/validaciones.middleware.js";

export const validarId = [
    param("id")
        .isInt({ min: 1 }).withMessage("El ID del examen debe ser mayor a 0"),
    verificarValidaciones
];