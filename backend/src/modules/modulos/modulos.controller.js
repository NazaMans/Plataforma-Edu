import * as modulosService from "./modulos.service.js";

export const crearModulo = async (req, res) => {
    try {
        const { nombre, numero, teoria, practica, id_curso } = req.body;
        const modulo = await modulosService.crearModulo(nombre, numero, teoria, practica, id_curso);
        return res.status(201).json({ success: true, data: modulo });
    } catch (error) {
        return res.status(500).json({ message: "Error al crear el módulo", error: error.message });
    }
};

export const actualizarModulo = async (req, res) => {
    try {
        const { id } = req.params;
        const modulo = await modulosService.actualizarModulo({ id, ...req.body });
        return res.status(200).json({ success: true, data: modulo });
    } catch (error) {
        return res.status(500).json({ message: "Error al actualizar el módulo", error: error.message });
    }
};

export const getModulosByCurso = async (req, res) => {
    try {
        const { id } = req.params;
        const modulos = await modulosService.getModulosByCurso(id);
        return res.status(200).json({ success: true, data: modulos });
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener los módulos del curso", error: error.message });
    }
};

export const getModuloById = async (req, res) => {
    try {
        const { id } = req.params;
        const modulo = await modulosService.getModuloById(id);
        return res.status(200).json({ success: true, data: modulo });
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener el módulo", error: error.message });
    }
};

