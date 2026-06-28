import { body, param } from "express-validator";
import { verificarValidaciones } from "../../middlewares/validaciones.middleware.js";

export const validarId = [
    param("id")
        .isInt({ min: 1 }).withMessage("El ID del usuario debe ser mayor a 0"),
    verificarValidaciones
];

export const validarUsuario = [
    body("nombre").notEmpty().withMessage("El nombre es obligatorio").isString(),
    body("apellido").notEmpty().withMessage("El apellido es obligatorio").isString(),
    body("usuario").notEmpty().withMessage("El usuario es obligatorio").isString(),
    body("password").notEmpty().withMessage("La contraseña es obligatoria").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
    body("rol").notEmpty().withMessage("El rol es obligatorio").isIn(["Admin", "Profesor", "Estudiante"]).withMessage("El rol debe ser Admin, Profesor o Estudiante"),
    body("universidad").notEmpty().withMessage("La universidad es obligatoria").isIn(["UTN", "UNLaR", "Otra"]).withMessage("La universidad debe ser UTN, UNLaR u Otra"),
    body("numero").optional().isString().withMessage("El numero debe ser un texto"),
    verificarValidaciones
];

export const validarEditarUsuario = [
    param("id").isInt({ min: 1 }).withMessage("El ID del usuario debe ser mayor a 0"),
    body("nombre").optional().isString().withMessage("El nombre debe ser un texto"),
    body("apellido").optional().isString().withMessage("El apellido debe ser un texto"),
    body("usuario").optional().isString().withMessage("El usuario debe ser un texto"),
    body("deuda").optional().isBoolean().withMessage("Deuda debe ser un valor booleano"),
    body("fecha_pago").optional({ nullable: true }).isISO8601().withMessage("La fecha de pago debe tener un formato de fecha válido (YYYY-MM-DD)"),
    body("estado").optional().isBoolean().withMessage("Estado debe ser un valor booleano"),
    body("rol").optional().isIn(["Admin", "Profesor", "Estudiante"]).withMessage("El rol debe ser Admin, Profesor o Estudiante"),
    body("universidad").optional().isIn(["UTN", "UNLaR", "Otra"]).withMessage("La universidad debe ser UTN, UNLaR u Otra"),
    body("numero").optional({ nullable: true }).isString().withMessage("El número debe ser un texto"),
    verificarValidaciones
];