import * as usuariosService from "./usuarios.service.js";

export const getUsers = async (req, res) => {
    try {
        const users = await usuariosService.getUsers(req.query);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await usuariosService.getUserById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuario", error: error.message });
    }
};

export const editUser = async (req, res) => {
    try {
        const user = await usuariosService.editUser(req.params.id, req.body);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error al editar usuario", error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await usuariosService.deleteUser(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar usuario", error: error.message });
    }
};