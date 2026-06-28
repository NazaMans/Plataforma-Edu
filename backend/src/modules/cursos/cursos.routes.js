import {Router} from "express";
import * as cursosController from "./cursos.controller.js";
import { validarId } from "./cursos.validator.js";
import { verificarRoles } from "../../middlewares/rol.middleware.js";
import { verificarAutenticacion } from "../../middlewares/auth.middleware.js";

const router = Router();

//Crear curso
router.post("/", verificarAutenticacion, verificarRoles(["Admin"]), cursosController.generarCurso);

//Inscribir usuario
router.post("/inscribir", verificarAutenticacion, verificarRoles(["Admin"]), cursosController.inscribirUsuarioACurso);

//Editar curso
router.put("/editar/:id", validarId, verificarAutenticacion, verificarRoles(["Admin"]), cursosController.editarCurso);

//Desinscribir usuario a curso
router.delete("/desuscribir", verificarAutenticacion, verificarRoles(["Admin"]), cursosController.desinscribirUsuarioACurso);

//Obtener cursos para estudiantes
router.get("/estudiantes/:id", validarId, verificarAutenticacion, verificarRoles(["Admin", "Estudiante"]), cursosController.getCursosParaEstudiantes);

//Obtener cursos Admin
router.get("/admin", verificarAutenticacion, verificarRoles(["Admin"]), cursosController.getCursosAdmin);

//Eliminar curso
router.delete("/desactivar/:id", validarId, verificarAutenticacion, verificarRoles(["Admin"]), cursosController.eliminarCurso);

export default router;
