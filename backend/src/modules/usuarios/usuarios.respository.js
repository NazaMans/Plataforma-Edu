import pool from "../../config/db.js";

// Get usuarios con filtros dinámicos y paginación
export const getUsers = async (filters = {}) => {
    const { nombre, deuda, estado, rol, universidad, page, limit } = filters;

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

    if (limit) {
        const parsedLimit = parseInt(limit, 10);
        if (!isNaN(parsedLimit) && parsedLimit > 0) {
            params.push(parsedLimit);
            sql += ` LIMIT $${params.length}`;

            if (page) {
                const parsedPage = parseInt(page, 10);
                if (!isNaN(parsedPage) && parsedPage > 0) {
                    const offset = (parsedPage - 1) * parsedLimit;
                    params.push(offset);
                    sql += ` OFFSET $${params.length}`;
                }
            }
        }
    }

    const query = await pool.query(sql, params);
    return query.rows;
};

export const getUserById = async (id) => {
    const query = await pool.query("SELECT id, nombre, apellido, usuario, deuda, fecha_pago, estado, rol, universidad, numero FROM usuarios WHERE id = $1", [id]);
    return query.rows[0];
};


export const editUser = async (id, userData) => {
    let nombre, apellido, usuario, deuda, fecha_pago, estado, rol, universidad, numero;
    if (typeof userData === 'object' && userData !== null) {
        ({ nombre, apellido, usuario, deuda, fecha_pago, estado, rol, universidad, numero } = userData);
    } else {
        nombre = arguments[1];
        apellido = arguments[2];
        usuario = arguments[3];
        deuda = arguments[4];
        fecha_pago = arguments[5];
        estado = arguments[6];
        rol = arguments[7];
        universidad = arguments[8];
        numero = arguments[9];
    }

    const query = await pool.query(
        `UPDATE usuarios 
         SET nombre = COALESCE($1, nombre), 
             apellido = COALESCE($2, apellido), 
             usuario = COALESCE($3, usuario), 
             deuda = COALESCE($4, deuda), 
             fecha_pago = COALESCE($5, fecha_pago), 
             estado = COALESCE($6, estado), 
             rol = COALESCE($7, rol), 
             universidad = COALESCE($8, universidad), 
             numero = COALESCE($9, numero) 
         WHERE id = $10 
         RETURNING id, nombre, apellido, usuario, deuda, fecha_pago, estado, rol, universidad, numero`,
        [
            nombre !== undefined ? nombre : null,
            apellido !== undefined ? apellido : null,
            usuario !== undefined ? usuario : null,
            deuda !== undefined ? deuda : null,
            fecha_pago !== undefined ? fecha_pago : null,
            estado !== undefined ? estado : null,
            rol !== undefined ? rol : null,
            universidad !== undefined ? universidad : null,
            numero !== undefined ? numero : null,
            id
        ]
    );
    return query.rows[0];
};

export const deleteUser = async (id_usuario) => {
    const query = await pool.query("UPDATE usuarios SET estado = false WHERE id = $1 RETURNING id, nombre, apellido, usuario, estado", [id_usuario]);
    return query.rows[0];
};  

// export const getUserCompare = async (id) => {
//     const query = await pool.query("SELECT COUNT(*) FROM usuarios WHERE id = $1 AND", [id]);
//     return query.rows[0];
// };