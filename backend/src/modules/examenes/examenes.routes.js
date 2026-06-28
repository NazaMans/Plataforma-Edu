import {Router} from "express"
import * as examenesController from "./examenes.controller.js";
import { validarId } from "./examenes.validator.js";
import { verificarAutenticacion } from "../../middlewares/auth.middleware.js";
import { verificarRoles } from "../../middlewares/rol.middleware.js";

const router = Router();

//Crear examen
router.post("/", verificarAutenticacion, verificarRoles(["Admin"]), examenesController.crearExamenController);

// Get examen para admin
router.get("/admin", verificarAutenticacion, verificarRoles(["Admin"]), examenesController.getExamenesAdminController);

//Obtener examenes por curso
router.get("/curso/:id_curso", verificarAutenticacion, verificarRoles(["Admin", "Estudiante"]), examenesController.getExamenesPorCursoController);

//Get examen por id
router.get("/:id_examen", verificarAutenticacion, verificarRoles(["Admin", "Estudiante"]), examenesController.getExamenByIdController);

//Editar examen
router.put("/:id_examen", validarId, verificarAutenticacion, verificarRoles(["Admin"]), examenesController.editarExamenController);

//Eliminar examen
router.delete("/:id_examen", validarId, verificarAutenticacion, verificarRoles(["Admin"]), examenesController.eliminarExamenController);

export default router;
