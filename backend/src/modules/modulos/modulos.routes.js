import { Router } from "express";
import * as modulosController from "./modulos.controller.js";
import { validarId } from "./modulos.validator.js";
import { verificarRoles } from "../../middlewares/rol.middleware.js";
import { verificarAutenticacion } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verificarAutenticacion, verificarRoles(["Admin"], modulosController.crearModulo));
router.put("/:id", verificarAutenticacion, validarId, verificarRoles(["Admin"], modulosController.actualizarModulo));
router.get("/:id", verificarAutenticacion, validarId, verificarRoles(["Admin", "Docente"], modulosController.getModuloById));
router.get("/curso/:id", verificarAutenticacion, validarId, verificarRoles(["Admin", "Docente"], modulosController.getModulosByCurso));

export default router;