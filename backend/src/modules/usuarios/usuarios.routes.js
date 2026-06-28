import { Router } from "express";
import * as usuariosController from "./usuarios.controller.js";
import { validarId, validarEditarUsuario } from "./usuarios.validator.js";
import { verificarRoles } from "../../middlewares/rol.middleware.js";
import { verificarAutenticacion } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verificarAutenticacion, verificarRoles(["Admin"]), usuariosController.getUsers);
router.get("/:id", verificarAutenticacion, validarId, verificarRoles(["Admin"]), usuariosController.getUserById);
router.put("/:id", verificarAutenticacion, validarEditarUsuario, verificarRoles(["Admin"]), usuariosController.editUser);
router.delete("/:id", verificarAutenticacion, validarId, verificarRoles(["Admin"]), usuariosController.deleteUser);

export default router;
