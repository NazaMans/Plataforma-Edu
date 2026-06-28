import * as modulosRepository from "./modulos.repository.js";

export const crearModulo = async (nombre, numero, teoria, practica, id_curso) => {
    return await modulosRepository.crearModulo(nombre, numero, teoria, practica, id_curso);
}

export const actualizarModulo = async (datos) => {
    return await modulosRepository.actualizarModulo(datos);
}

export const getModulosByCurso = async (id_curso) => {
    return await modulosRepository.getModulosByCurso(id_curso);
}

export const getModuloById = async (id_modulo) => {
    return await modulosRepository.getModuloById(id_modulo);
}