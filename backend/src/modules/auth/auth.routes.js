import { Router } from "express";
import { register, login, logout } from "./auth.controller.js";
import { validarLogin, validarRegistro } from "./auth.validator.js";
import { verificarRoles } from "../../middlewares/rol.middleware.js";
import { verificarAutenticacion } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", verificarAutenticacion, verificarRoles(["Admin"]), validarRegistro, register);

router.post("/login", validarLogin, login);

router.post("/logout", logout);

export default router;