import { body, param } from "express-validator";
import { verificarValidaciones } from "../../middlewares/validaciones.middleware.js";

export const validarIdModulo = [
    param("id")
        .isInt({ min: 1 }).withMessage("El ID del módulo debe ser mayor a 0"),
    verificarValidaciones
];

export const validarIdCursoModulo = [
    param("id")
        .isInt({ min: 1 }).withMessage("El ID del curso debe ser mayor a 0"),
    verificarValidaciones
];

export const validarCrearModulo = [
    body("id_curso")
        .notEmpty().withMessage("El ID del curso es obligatorio")
        .isInt({ min: 1 }).withMessage("El ID del curso debe ser un número entero mayor a 0"),
    body("teoria")
        .notEmpty().withMessage("La teoría es obligatoria")
        .isString().withMessage("La teoría debe ser un texto"),
    body("practica")
        .notEmpty().withMessage("La práctica es obligatoria")
        .isString().withMessage("La práctica debe ser un texto"),
    body("nombre")
        .optional()
        .isString().withMessage("El nombre del módulo debe ser un texto"),
    body("numero")
        .optional({ nullable: true })
        .isInt({ min: 0 }).withMessage("El número del módulo debe ser un entero positivo o 0"),
    verificarValidaciones
];

export const validarActualizarModulo = [
    param("id")
        .isInt({ min: 1 }).withMessage("El ID del módulo debe ser mayor a 0"),
    body("id_curso")
        .optional()
        .isInt({ min: 1 }).withMessage("El ID del curso debe ser un número entero mayor a 0"),
    body("teoria")
        .optional()
        .isString().withMessage("La teoría debe ser un texto"),
    body("practica")
        .optional()
        .isString().withMessage("La práctica debe ser un texto"),
    body("nombre")
        .optional()
        .isString().withMessage("El nombre del módulo debe ser un texto"),
    body("numero")
        .optional({ nullable: true })
        .isInt({ min: 0 }).withMessage("El número del módulo debe ser un entero positivo o 0"),
    verificarValidaciones
];