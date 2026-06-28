import pool from "../../config/db.js";

// Get usuarios con filtros dinámicos
export const getUsers = async (filters = {}) => {
    const { nombre, deuda, estado, rol, universidad } = filters;

    let sql = `
        SELECT id, nombre, apellido, usuario, deuda, fecha_pago, estado, rol, universidad, numero 
        FROM usuarios 
        WHERE 1=1
    `;
    const params = [];

    if (nombre) {
        params.push(`%${nombre}%`);
        sql += ` AND (nombre ILIKE $${params.length} OR apellido ILIKE $${params.length})`;
    }

    if (deuda !== undefined && deuda !== null && deuda !== "") {
        params.push(deuda === true || deuda === "true");
        sql += ` AND deuda = $${params.length}`;
    }

    if (estado !== undefined && estado !== null && estado !== "") {
        params.push(estado === true || estado === "true");
        sql += ` AND estado = $${params.length}`;
    } else {
        // Por defecto, si no se especifica el filtro de estado, traemos los usuarios activos
        sql += ` AND estado = true`;
    }

    if (rol) {
        params.push(rol);
        sql += ` AND rol = $${params.length}`;
    }

    if (universidad) {
        params.push(universidad);
        sql += ` AND universidad = $${params.length}`;
    }

    sql += ` ORDER BY id ASC`;

    const query = await pool.query(sql, params);
    return query.rows;
};

export const getUserById = async (id) => {
    const query = await pool.query("SELECT nombre, apellido, usuario, deuda, fecha_pago, estado, rol, universidad, numero FROM usuarios WHERE id = $1", [id]);
    return query.rows[0];
};


export const editUser = async (id_usuario, nombre, apellido, usuario, deuda, fecha_pago, estado, rol, universidad, numero) => {
    const query = await pool.query("UPDATE usuarios SET nombre = $1, apellido = $2, usuario = $3, deuda = $4, fecha_pago = $5, estado = $6, rol = $7, universidad = $8, numero = $9 WHERE id = $10", [id_usuario, nombre, apellido, usuario, deuda, fecha_pago, estado, rol, universidad, numero]);
    return query.rows[0];
};

export const deleteUser = async (id_usuario) => {
    const query = await pool.query("UPDATE usuarios SET estado = false WHERE id = $1", [id_usuario]);
    return query.rows[0];
};  

// export const getUserCompare = async (id) => {
//     const query = await pool.query("SELECT COUNT(*) FROM usuarios WHERE id = $1 AND", [id]);
//     return query.rows[0];
// };