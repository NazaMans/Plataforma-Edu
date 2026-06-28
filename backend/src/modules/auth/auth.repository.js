import pool from "../../config/db.js";

export const crearUsuario = async (nombre, apellido, usuario, password_hash, rol, universidad, numero) => {
    const result = await pool.query(
        "INSERT INTO usuarios (nombre, apellido, usuario, password, rol, universidad, numero) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [nombre, apellido, usuario, password_hash, rol, universidad, numero]
    );
    return result.rows[0];
};

export const obtenerUserCompare = async (usuario) => {
    const result = await pool.query(
        "SELECT id, nombre, apellido, password, estado, rol FROM usuarios WHERE usuario = $1",
        [usuario]
    );
    return result.rows[0];
};