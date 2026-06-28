import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const {Pool} = pg;
const pool = new Pool({
    connectionString: process.env.DB_URI,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

export const testConection = async () => {
    try {
        const res = await pool.query("SELECT NOW()");
        console.log("Conexion exitosa a la base de datos. Hora del servidor ", res.rows[0].now)
    } catch (error) {

        console.error("Error al conectar la base de datos", error.message);
        process.exit(1);
        
    }
};

export default pool;
