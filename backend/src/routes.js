import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import cursosRoutes from "./modules/cursos/cursos.routes.js";

const router = Router();

//Ruta publica
router.use("/auth", authRoutes);

//Rutas privadas
router.use("/cursos", cursosRoutes);

export default router;