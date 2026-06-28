import { Router } from "express";
import * as examenesController from "./examenes.controller.js";
import { validarIdExamen, validarIdCursoParam, validarCrearExamen, validarEditarExamen } from "./examenes.validator.js";
import { verificarAutenticacion } from "../../middlewares/auth.middleware.js";
import { verificarRoles } from "../../middlewares/rol.middleware.js";

const router = Router();

//Crear examen
router.post("/crear", verificarAutenticacion, verificarRoles(["Admin"]), validarCrearExamen, examenesController.crearExamenController);

// Get examen para admin
router.get("/admin", verificarAutenticacion, verificarRoles(["Admin"]), examenesController.getExamenesAdminController);

//Obtener examenes por curso
router.get("/curso/:id_curso", verificarAutenticacion, verificarRoles(["Admin", "Estudiante"]), validarIdCursoParam, examenesController.getExamenesPorCursoController);

//Get examen por id
router.get("/:id_examen", verificarAutenticacion, verificarRoles(["Admin", "Estudiante"]), validarIdExamen, examenesController.getExamenByIdController);

//Editar examen
router.put("/editar/:id_examen", verificarAutenticacion, verificarRoles(["Admin"]), validarEditarExamen, examenesController.editarExamenController);

//Eliminar examen
router.patch("/desactivar/:id_examen", verificarAutenticacion, verificarRoles(["Admin"]), validarIdExamen, examenesController.eliminarExamenController);

//Activar examen
router.patch("/activar/:id_examen", verificarAutenticacion, verificarRoles(["Admin"]), validarIdExamen, examenesController.activarExamenController);

export default router;
