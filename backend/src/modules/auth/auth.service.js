import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { crearUsuario, obtenerUserCompare } from "./auth.repository.js";

export const registrarUsuario = async (datos) => {
    const {nombre, apellido, usuario, password, rol, universidad, numero} = datos;
    const usuarioExistente = await obtenerUserCompare(usuario);
    if(usuarioExistente) {
        const error = new Error("El usuario ya existe");
        error.status = 400;
        throw error;
    }

    const saltRound = 10;
    const password_hash = await bcrypt.hash(password, saltRound);

    const nuevoUsuario = await crearUsuario(nombre, apellido, usuario, password_hash, rol, universidad, numero);
    
    return {
        id: nuevoUsuario.id,
        usuario: nuevoUsuario.usuario,
        rol: nuevoUsuario.rol
    }

}

export const loginUsuario = async (credenciales) => {

    const {usuario, password} = credenciales;
    console.log("El login llego a service");

    const usuarioExistente = await obtenerUserCompare(usuario);

    if (!usuarioExistente) {
        const error = new Error("Credenciales invalidas");
        error.status = 401;
        throw error;
    }
    
    if (!usuarioExistente.estado) {
        const error = new Error("Usuario inactivo");
        error.status = 401;
        throw error;
    }

    const passwordValido = await bcrypt.compare(password, usuarioExistente.password);
    if (!passwordValido) {
        const error = new Error("Credenciales invalidas");
        error.status = 401;
        throw error;
    }

    const payload = {
        id_usuario: usuarioExistente.id,
        nombre: usuarioExistente.nombre,
        apellido: usuarioExistente.apellido,
        usuario: usuario,
        rol: usuarioExistente.rol
    }

    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
    );
    return {
        usuario: payload,
        token
    }

}