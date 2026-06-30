import { apiFetch } from "../api.js";

export const modulosService = {
  getModulosByCurso: async (cursoId) => {
    return apiFetch(`/api/modulos/curso/${cursoId}`);
  },

  getModuloById: async (id) => {
    return apiFetch(`/api/modulos/${id}`);
  },

  crearModulo: async (datos) => {
    return apiFetch("/api/modulos", {
      method: "POST",
      body: JSON.stringify(datos),
    });
  },

  actualizarModulo: async (id, datos) => {
    return apiFetch(`/api/modulos/${id}`, {
      method: "PUT",
      body: JSON.stringify(datos),
    });
  }
};
