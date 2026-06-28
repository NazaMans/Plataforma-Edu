import * as service from "./cursos.service.js";

//Crear curso

export const generarCurso = async (req, res) => {
    const {nombre} = req.body;
    const curso = await service.generarCursoService(nombre);
    return res.status(201).json({success: true, data: curso});
}

//Inscribir usuario

export const inscribirUsuarioACurso = async (req, res) => {
    const {id_curso, id_usuario} = req.body;
    const curso = await service.inscribirUsuarioACursoService({id_curso, id_usuario});
    return res.status(201).json({success: true, data: curso});
}

//Editar curso

export const editarCurso = async (req, res) => {
    const {id_curso, nombre, estado} = req.body;
    const curso = await service.editarCursoService(id_curso, nombre, estado);
    return res.status(201).json({success: true, data: curso});
}

//Desinscribir usuario a curso

export const desinscribirUsuarioACurso = async (req, res) => {
    const {id_curso, id_usuario} = req.body;
    const curso = await service.desinscribirUsuarioACursoService({id_curso, id_usuario});
    return res.status(200).json({success: true, data: curso});
}

//Obtener cursos para estudiantes

export const getCursosParaEstudiantes = async (req, res) => {
    const {id} = req.params;
    const cursos = await service.getCursosParaEstudiantesService(id);
    return res.status(200).json({success: true, data: cursos});
}

//Obtener cursos Admin

export const getCursosAdmin = async (req, res) => {
    const cursos = await service.getCursosAdminService();
    return res.status(200).json({success: true, data: cursos});
}

//Eliminar curso

export const eliminarCurso = async (req, res) => {
    const {id} = req.params;
    const curso = await service.eliminarCursoService(id);
    return res.status(201).json({success: true, data: curso});
}