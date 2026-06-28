import pool from "../../config/db.js";

//Crear nuevo curso
export const crearCurso = async (nombre) => {
    const query = await pool.query("INSERT INTO cursos (nombre) VALUES ($1)", [nombre]);
    return query.rows[0];
};

//Inscribir usuario a curso

export const inscribirUsuarioACurso = async (id_curso, id_usuario) => {
    const query = await pool.query("INSERT INTO cursos_usuarios (id_curso, id_usuario) VALUES ($1, $2)", [id_curso, id_usuario]);
    return query.rows[0];
};

//Editar curso
export const editarCurso = async (id_curso, nombre, estado) => {
    const query = await pool.query("UPDATE cursos SET nombre = $1, estado = $2 WHERE id = $3", [nombre, estado, id_curso]);
    return query.rows[0];
};

//Desinscribir usuario a curso
export const desinscribirUsuarioACurso = async (id_curso, id_usuario) => {
    const query = await pool.query("DELETE FROM cursos_usuarios WHERE id_curso = $1 AND id_usuario = $2", [id_curso, id_usuario]);
    return query.rows[0];
};

//Obtener cursos para estudiantes
export const getCursosParaEstudiantes = async (id_usuario) => {
    const query = await pool.query(`
    SELECT 
        c.id,
        c.nombre,
        c.estado
    FROM cursos c
    JOIN cursos_usuarios cu ON c.id = cu.id_curso
    WHERE cu.id_usuario = $1
    `, [id_usuario]);
    return query.rows;
};

//Obtener cursos Admin
export const getCursosAdmin = async () => {
    const query = await pool.query(`
    SELECT 
        c.id,
        c.nombre,
        c.estado
    FROM cursos c
    ORDER BY c.id ASC
    `);
    return query.rows;
};

//Get curso por nombre

export const getCursoByName = async (nombre) => {
    const query = await pool.query("SELECT COUNT(*) as c FROM cursos WHERE nombre = $1", [nombre]);
    return query.rows[0];
};

export const getCursoEditByName = async (nombre, id_curso) => {
    const query = await pool.query("SELECT COUNT(*) as c FROM cursos WHERE nombre = $1 AND id != $2", [nombre, id_curso]);
    return query.rows[0];
};

export const eliminarCurso = async (id_curso) => {
    const query = await pool.query("UPDATE cursos SET estado = false WHERE id = $1", [id_curso]);
    return query.rows[0];
};

//Obtener curso para estudiantes
// export const getCursoParaEstudiante = async (id_curso, id_usuario) => {
//     const query = await pool.query(`
//     SELECT 
//         c.id,
//         c.nombre,
//         c.estado
//     FROM cursos c
//     JOIN cursos_usuarios cu ON c.id = cu.id_curso
//     WHERE cu.id_curso = $1 AND cu.id_usuario = $2
//     `, [id_curso, id_usuario]);
//     return query.rows[0];
// };
