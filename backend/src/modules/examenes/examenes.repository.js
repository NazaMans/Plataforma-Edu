import pool from "../../config/db.js";

export const crearExamen = async (id_curso, nombre, actividad, resolucion) => {
    const query = await pool.query(`
    INSERT INTO examenes (curso_id, nombre, actividad, resolucion)
    VALUES ($1, $2, $3, $4)
    `, [id_curso, nombre, actividad, resolucion]);
    return query.rows[0];
};

// Get examen para admin
export const getExamenesAdmin = async () => {
    const query = await pool.query(`
    SELECT 
        e.id,
        e.nombre,
        e.actividad,
        e.resolucion
    FROM examenes e
    ORDER BY e.id ASC
    `);
    return query.rows;
};

//Obtener examenes por curso
export const getExamenesPorCurso = async (id_curso) => {
    const query = await pool.query(`
    SELECT 
        e.id,
        e.nombre
    FROM examenes e
    WHERE e.curso_id = $1 AND e.estado = true
    ORDER BY e.id ASC
    `, [id_curso]);
    return query.rows;
};

//Get examen por id
export const getExamenById = async (id_examen) => {
    const query = await pool.query(`
    SELECT 
        e.id,
        e.nombre,
        e.actividad,
        e.resolucion
    FROM examenes e
    WHERE e.id = $1 AND e.estado = true
    `, [id_examen]);
    return query.rows[0];
};

//Editar examen
export const editarExamen = async (id_examen, id_curso, nombre, actividad, resolucion) => {
    const query = await pool.query(`
    UPDATE examenes SET curso_id = $1, nombre = $2, actividad = $3, resolucion = $4 WHERE id = $5
    `, [id_curso, nombre, actividad, resolucion, id_examen]);
    return query.rows[0];
};

//Eliminar examen
export const eliminarExamen = async (id_examen) => {
    const query = await pool.query("UPDATE examenes SET estado = false WHERE id = $1", [id_examen]);
    return query.rows[0];
};

//Activar examen

export const activarExamen = async (id_examen) => {
    const query = await pool.query("UPDATE examenes SET estado = true WHERE id = $1", [id_examen]);
    return query.rows[0];
}