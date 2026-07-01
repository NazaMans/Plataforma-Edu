import { crearCurso,inscribirUsuarioACurso, editarCurso, desinscribirUsuarioACurso, getCursosParaEstudiantes, getCursosAdmin, getCursoByName, getCursoEditByName, eliminarCurso } from "./cursos.repisitory.js";

//Crear curso

export const generarCurso = async (datos) => {
    const {nombre} = datos;

    const cursoExistente = await getCursoByName(nombre);

    if (cursoExistente.c > 0) {
        const error = new Error("El curso ya existe");
        error.status = 409;
        throw error;
    }

    return await crearCurso(nombre);
}

//Inscribir usuario a curso

export const inscribirUsuarioACursoService = async (datos) => {
    const {id_curso, id_usuario} = datos;

    return await inscribirUsuarioACurso(id_curso, id_usuario);
}

//Editar curso

export const editarCursoService = async (datos) => {
    const {id_curso, nombre, estado} = datos;

    const cursoExistente = await getCursoEditByName(nombre, id_curso);

    if (cursoExistente.c > 0) {
        const error = new Error("El curso ya existe");
        error.status = 409;
        throw error;
    }

    return await editarCurso(id_curso, nombre, estado);
}

//Desinscribir usuario a curso

export const desinscribirUsuarioACursoService = async (datos) => {
    const {id_curso, id_usuario} = datos;
    return await desinscribirUsuarioACurso(id_curso, id_usuario);
}

//Obtener cursos para estudiantes

export const getCursosParaEstudiantesService = async (id_usuario) => {
    return await getCursosParaEstudiantes(id_usuario);
}

//Obtener cursos Admin

export const getCursosAdminService = async () => {
    return await getCursosAdmin();
}

//Eliminar curso

export const eliminarCursoService = async (id_curso) => {
    return await eliminarCurso(id_curso);
}