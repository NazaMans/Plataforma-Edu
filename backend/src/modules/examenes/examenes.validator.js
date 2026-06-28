import { body, param } from "express-validator";
import { verificarValidaciones } from "../../middlewares/validaciones.middleware.js";

export const validarIdExamen = [
    param("id_examen")
        .isInt({ min: 1 }).withMessage("El ID del examen debe ser mayor a 0"),
    verificarValidaciones
];

export const validarIdCursoParam = [
    param("id_curso")
        .isInt({ min: 1 }).withMessage("El ID del curso debe ser mayor a 0"),
    verificarValidaciones
];

export const validarCrearExamen = [
    body("id_curso")
        .notEmpty().withMessage("El ID del curso es obligatorio")
        .isInt({ min: 1 }).withMessage("El ID del curso debe ser un entero válido mayor a 0"),
    body("nombre")
        .optional()
        .isString().withMessage("El nombre del examen debe ser texto"),
    body("actividad")
        .optional({ nullable: true })
        .isString().withMessage("La actividad debe ser texto"),
    body("resolucion")
        .optional({ nullable: true })
        .isString().withMessage("La resolución debe ser texto"),
    verificarValidaciones
];

export const validarEditarExamen = [
    param("id_examen")
        .isInt({ min: 1 }).withMessage("El ID del examen debe ser mayor a 0"),
    body("id_curso")
        .optional()
        .isInt({ min: 1 }).withMessage("El ID del curso debe ser un entero válido mayor a 0"),
    body("nombre")
        .optional()
        .isString().withMessage("El nombre del examen debe ser texto"),
    body("actividad")
        .optional({ nullable: true })
        .isString().withMessage("La actividad debe ser texto"),
    body("resolucion")
        .optional({ nullable: true })
        .isString().withMessage("La resolución debe ser texto"),
    verificarValidaciones
];