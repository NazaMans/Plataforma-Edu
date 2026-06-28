import * as usuariosRepository from "./usuarios.respository.js";

export const getUsers = async () => {
    return await usuariosRepository.getUsers();
};

export const getUserById = async (id) => {
    return await usuariosRepository.getUserById(id);
};

export const editUser = async (id_usuario, nombre, apellido, usuario, deuda, fecha_pago, estado, rol, universidad, numero) => {
    return await usuariosRepository.editUser(id_usuario, nombre, apellido, usuario, deuda, fecha_pago, estado, rol, universidad, numero);
};

export const deleteUser = async (id_usuario) => {
    return await usuariosRepository.deleteUser(id_usuario);
};
