import { Router } from "express";
import * as cursosController from "./cursos.controller.js";
import { validarId, validarCrearCurso, validarEditarCurso, validarInscripcion } from "./cursos.validator.js";
import { verificarRoles } from "../../middlewares/rol.middleware.js";
import { verificarAutenticacion } from "../../middlewares/auth.middleware.js";

const router = Router();

//Crear curso
router.post("/", verificarAutenticacion, verificarRoles(["Admin"]), validarCrearCurso, cursosController.generarCurso);

//Inscribir usuario
router.post("/inscribir", verificarAutenticacion, verificarRoles(["Admin"]), validarInscripcion, cursosController.inscribirUsuarioACurso);

//Editar curso
router.put("/editar/:id", verificarAutenticacion, verificarRoles(["Admin"]), validarEditarCurso, cursosController.editarCurso);

//Desinscribir usuario a curso
router.delete("/desuscribir", verificarAutenticacion, verificarRoles(["Admin"]), validarInscripcion, cursosController.desinscribirUsuarioACurso);

//Obtener cursos para estudiantes
router.get("/estudiantes/:id", verificarAutenticacion, verificarRoles(["Admin", "Estudiante"]), validarId, cursosController.getCursosParaEstudiantes);

//Obtener cursos Admin
router.get("/admin", verificarAutenticacion, verificarRoles(["Admin"]), cursosController.getCursosAdmin);

//Eliminar curso
router.delete("/desactivar/:id", verificarAutenticacion, verificarRoles(["Admin"]), validarId, cursosController.eliminarCurso);

export default router;
