import pool from "../../config/db.js";


//Crear modulo (nombre_modulo, id_curso)

export const crearModulo = async (nombre, numero, teoria, practica, id_curso) => {
    const query = await pool.query("INSERT INTO cursos_modulos (nombre, numero, teoria, practica, id_curso) VALUES ($1, $2, $3, $4, $5) RETURNING *", [nombre, numero, teoria, practica, id_curso]);
    return query.rows[0];
}

//Modificar Modulo 

export const actualizarModulo = async (datos) => {
    const { id, id_modulo, id_curso, nombre, numero, teoria, practica } = datos;
    const targetId = id || id_modulo;

    if (targetId) {
        const query = await pool.query(
            `UPDATE cursos_modulos 
             SET nombre = COALESCE($2, nombre), 
                 numero = COALESCE($3, numero), 
                 teoria = COALESCE($4, teoria), 
                 practica = COALESCE($5, practica),
                 id_curso = COALESCE($6, id_curso)
             WHERE id = $1 RETURNING *`,
            [targetId, nombre !== undefined ? nombre : null, numero !== undefined ? numero : null, teoria !== undefined ? teoria : null, practica !== undefined ? practica : null, id_curso !== undefined ? id_curso : null]
        );
        return query.rows[0];
    } else {
        const query = await pool.query(
            `UPDATE cursos_modulos 
             SET nombre = COALESCE($2, nombre), 
                 numero = COALESCE($3, numero), 
                 teoria = COALESCE($4, teoria), 
                 practica = COALESCE($5, practica) 
             WHERE id_curso = $1 RETURNING *`,
            [id_curso, nombre !== undefined ? nombre : null, numero !== undefined ? numero : null, teoria !== undefined ? teoria : null, practica !== undefined ? practica : null]
        );
        return query.rows[0];
    }
}

//Obtener modulos por id_curso

export const getModulosByCurso = async (id_curso) => {
    const query = await pool.query("SELECT id, nombre, numero, teoria, practica, id_curso FROM cursos_modulos WHERE id_curso = $1 ORDER BY numero ASC, id ASC", [id_curso]);
    return query.rows;
}

//Obtener modulo por id

export const getModuloById = async (id_modulo) => {
    const query = await pool.query("SELECT * FROM cursos_modulos WHERE id = $1", [id_modulo]);
    return query.rows[0];
}
