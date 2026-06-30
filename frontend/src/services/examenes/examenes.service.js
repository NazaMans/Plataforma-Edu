import { apiFetch } from "../api.js";

export const examenesService = {
  getExamenesPorCurso: async (cursoId) => {
    return apiFetch(`/api/examenes/curso/${cursoId}`);
  },

  getExamenById: async (id) => {
    return apiFetch(`/api/examenes/${id}`);
  },

  crearExamen: async (datos) => {
    return apiFetch("/api/examenes/crear", {
      method: "POST",
      body: JSON.stringify(datos),
    });
  },

  getExamenesAdmin: async () => {
    return apiFetch("/api/examenes/admin");
  }
};
