import * as examenesService from "./examenes.service.js";

export const crearExamenController = async (req, res) => {
    try {
        const { id_curso, nombre, actividad, resolucion } = req.body;
        const examen = await examenesService.crearExamenService(id_curso, nombre, actividad, resolucion);
        res.status(201).json({ message: "Examen creado exitosamente", examen });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el examen", error: error.message });
    }
};

// Get examen para admin
export const getExamenesAdminController = async (req, res) => {
    try {
        const examenes = await examenesService.getExamenesAdminService();
        res.status(200).json(examenes);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los examenes", error: error.message });
    }
};

//Obtener examenes por curso
export const getExamenesPorCursoController = async (req, res) => {
    try {
        const { id_curso } = req.params;
        const examenes = await examenesService.getExamenesPorCursoService(id_curso);
        res.status(200).json(examenes);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los examenes", error: error.message });
    }
};

//Get examen por id
export const getExamenByIdController = async (req, res) => {
    try {
        const { id_examen } = req.params;
        const examen = await examenesService.getExamenByIdService(id_examen);
        res.status(200).json(examen);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el examen", error: error.message });
    }
};

//Editar examen
export const editarExamenController = async (req, res) => {
    try {
        const { id_examen } = req.params;
        const { id_curso, nombre, actividad, resolucion } = req.body;
        const examen = await examenesService.editarExamenService(id_examen, id_curso, nombre, actividad, resolucion);
        res.status(200).json({ message: "Examen editado exitosamente", examen });
    } catch (error) {
        res.status(500).json({ message: "Error al editar el examen", error: error.message });
    }
};

//Eliminar examen
export const eliminarExamenController = async (req, res) => {
    try {
        const { id_examen } = req.params;
        const examen = await examenesService.eliminarExamenService(id_examen);
        res.status(200).json({ message: "Examen eliminado exitosamente", examen });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el examen", error: error.message });
    }
};


// Activar examen 

export const activarExamenController = async (req, res) => {
    try {
        const { id_examen } = req.params;
        const examen = await examenesService.activarExamenService(id_examen);
        res.status(200).json({ message: "Examen activado exitosamente", examen });
    } catch (error) {
        res.status(500).json({ message: "Error al activar el examen", error: error.message });
    }
};