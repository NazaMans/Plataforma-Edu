import { Router } from "express";
import * as modulosController from "./modulos.controller.js";
import { validarIdModulo, validarIdCursoModulo, validarCrearModulo, validarActualizarModulo } from "./modulos.validator.js";
import { verificarRoles } from "../../middlewares/rol.middleware.js";
import { verificarAutenticacion } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verificarAutenticacion, verificarRoles(["Admin"]), validarCrearModulo, modulosController.crearModulo);
router.put("/:id", verificarAutenticacion, verificarRoles(["Admin"]), validarActualizarModulo, modulosController.actualizarModulo);
router.get("/:id", verificarAutenticacion, verificarRoles(["Admin", "Docente"]), validarIdModulo, modulosController.getModuloById);
router.get("/curso/:id", verificarAutenticacion, verificarRoles(["Admin", "Docente"]), validarIdCursoModulo, modulosController.getModulosByCurso);

export default router;