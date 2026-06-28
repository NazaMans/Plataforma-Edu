import { body } from "express-validator";
import { verificarValidaciones } from "../../middlewares/validaciones.middleware.js";

export const validarLogin = [
    body("usuario")
        .notEmpty().withMessage("El usuario es obligatorio")
        .isString().withMessage("El usuario debe ser un texto"),
    body("password")
        .notEmpty().withMessage("La contraseña es obligatoria"),
    verificarValidaciones
];

export const validarRegistro = [
    body("nombre")
        .notEmpty().withMessage("El nombre es obligatorio")
        .isString().withMessage("El nombre debe ser un texto"),
    body("apellido")
        .notEmpty().withMessage("El apellido es obligatorio")
        .isString().withMessage("El apellido debe ser un texto"),
    body("usuario")
        .notEmpty().withMessage("El usuario es obligatorio")
        .isString().withMessage("El usuario debe ser un texto"),
    body("password")
        .notEmpty().withMessage("La contraseña es obligatoria")
        .isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
    body("rol")
        .notEmpty().withMessage("El rol es obligatorio")
        .isIn(["Admin", "Profesor", "Estudiante"]).withMessage("El rol debe ser Admin, Profesor o Estudiante"),
    body("universidad")
        .notEmpty().withMessage("La universidad es obligatoria")
        .isIn(["UTN", "UNLaR", "Otra"]).withMessage("La universidad debe ser UTN, UNLaR u Otra"),
    body("numero")
        .optional()
        .isString().withMessage("El número debe ser un texto"),
    verificarValidaciones
];
