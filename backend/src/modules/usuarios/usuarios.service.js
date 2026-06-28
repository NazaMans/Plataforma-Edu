import * as usuariosRepository from "./usuarios.respository.js";

export const getUsers = async (filters = {}) => {
    return await usuariosRepository.getUsers(filters);
};

export const getUserById = async (id) => {
    return await usuariosRepository.getUserById(id);
};

export const editUser = async (id_usuario, userData) => {
    return await usuariosRepository.editUser(id_usuario, userData);
};

export const deleteUser = async (id_usuario) => {
    return await usuariosRepository.deleteUser(id_usuario);
};
