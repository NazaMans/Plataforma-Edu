import {Router} from "express";
import { register, login } from "./auth.controller.js";
import { verificarRoles } from "../../middlewares/rol.middleware.js";
import { verificarAutenticacion } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/register",verificarAutenticacion, verificarRoles(["Admin"]), register);

router.post("/login", login);

export default router;