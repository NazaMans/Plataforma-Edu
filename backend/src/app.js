import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import appRoutes from "./routes.js";
import { passportConfig } from "./config/passport.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();
const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

//Se setea cookieparser para poder manejar las cookies
app.use(cookieParser());

app.use(express.json());
passportConfig();

app.get("/", (req, res) => {
    res.json({message: "Servidor funcionando"});
});

app.use("/api", appRoutes);

app.use(errorHandler);
export default app;

