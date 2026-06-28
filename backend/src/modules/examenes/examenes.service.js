import * as examenesRepository from "./examenes.repository.js";

export const crearExamenService = async (id_curso, nombre, actividad, resolucion) => {
    return examenesRepository.crearExamen(id_curso, nombre, actividad, resolucion);
};

// Get examen para admin
export const getExamenesAdminService = async () => {
    return examenesRepository.getExamenesAdmin();
};

//Obtener examenes por curso
export const getExamenesPorCursoService = async (id_curso) => {
    return examenesRepository.getExamenesPorCurso(id_curso);
};

//Get examen por id
export const getExamenByIdService = async (id_examen) => {
    return examenesRepository.getExamenById(id_examen);
};

//Editar examen
export const editarExamenService = async (id_examen, id_curso, nombre, actividad, resolucion) => {
    return examenesRepository.editarExamen(id_examen, id_curso, nombre, actividad, resolucion);
};

//Eliminar examen
export const eliminarExamenService = async (id_examen) => {
    return examenesRepository.eliminarExamen(id_examen);
};

//Activar examen

export const activarExamenService = async (id_examen)=> {
    return examenesRepository.activarExamen(id_examen);
};
 