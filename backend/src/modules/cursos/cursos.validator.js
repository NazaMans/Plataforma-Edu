import { body, param } from "express-validator";
import { verificarValidaciones } from "../../middlewares/validaciones.middleware.js";

export const validarId = [
    param("id")
        .isInt({ min: 1 }).withMessage("El ID del curso debe ser un número entero positivo mayor a 0"),
    verificarValidaciones
];

export const validarCrearCurso = [
    body("nombre")
        .notEmpty().withMessage("El nombre del curso es obligatorio")
        .isString().withMessage("El nombre del curso debe ser un texto"),
    verificarValidaciones
];

export const validarEditarCurso = [
    param("id")
        .isInt({ min: 1 }).withMessage("El ID del curso debe ser un número entero positivo mayor a 0"),
    body("nombre")
        .optional()
        .isString().withMessage("El nombre del curso debe ser un texto"),
    body("estado")
        .optional()
        .isBoolean().withMessage("El estado debe ser un booleano (true/false)"),
    verificarValidaciones
];

export const validarInscripcion = [
    body("id_curso")
        .notEmpty().withMessage("El ID del curso es obligatorio")
        .isInt({ min: 1 }).withMessage("El ID del curso debe ser un número entero positivo mayor a 0"),
    body("id_usuario")
        .notEmpty().withMessage("El ID del usuario es obligatorio")
        .isInt({ min: 1 }).withMessage("El ID del usuario debe ser un número entero positivo mayor a 0"),
    verificarValidaciones
];