import express from "express";
import cors from "cors";
import appRoutes from "./routes.js";
import { passportConfig } from "./config/passport.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();
app.use(cors());
app.use(express.json());
passportConfig();

app.get("/", (req, res) => {
    res.json({message: "Servidor funcionando"});
});

app.use("/api", appRoutes);

app.use(errorHandler);
export default app;

