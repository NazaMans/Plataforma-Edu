import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import cursosRoutes from "./modules/cursos/cursos.routes.js";
import examenesRoutes from "./modules/examenes/examenes.routes.js";
import usuariosRoutes from "./modules/usuarios/usuarios.routes.js";

const router = Router();

//Ruta publica
router.use("/auth", authRoutes);

//Rutas privadas
router.use("/cursos", cursosRoutes);
router.use("/examenes", examenesRoutes);
router.use("/usuarios", usuariosRoutes);

export default router;