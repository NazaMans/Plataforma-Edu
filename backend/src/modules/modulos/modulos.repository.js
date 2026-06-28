import pool from "../../config/db.js";


//Crear modulo (nombre_modulo, id_curso)

export const crearModulo = async (nombre, numero, teoria, practica, id_curso) => {
    const query = await pool.query("INSERT INTO cursos_modulos (nombre, numero, teoria, practica, id_curso) VALUES ($1, $2, $3, $4, $5) RETURNING *", [nombre, numero, teoria, practica, id_curso]);
    return query.rows[0];
}

//Modificar Modulo 

export const actualizarModulo = async (datos) => {
    const { id_curso, nombre, numero, teoria, practica } = datos;

    const query = await pool.query("UPDATE cursos_modulos SET nombre = $2, numero = $3, teoria = $4, practica = $5 WHERE id_curso = $1 RETURNING *", [id_curso, nombre, numero, teoria, practica]);
    return query.rows[0];
}

//Obtener modulos por id_curso

export const getModulosByCurso = async (id_curso) => {
    const query = await pool.query("SELECT nombre, numero FROM cursos_modulos WHERE id_curso = $1", [id_curso]);
    return query.rows[0];
}

//Obtener modulo por id

export const getModuloById = async (id_modulo) => {
    const query = await pool.query("SELECT * FROM cursos_modulos WHERE id = $1", [id_modulo]);
    return query.rows[0];
}
