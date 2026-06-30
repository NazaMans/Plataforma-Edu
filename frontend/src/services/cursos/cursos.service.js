import { apiFetch } from "../api.js";

export const cursosService = {
  getCursosParaEstudiantes: async (userId) => {
    return apiFetch(`/api/cursos/estudiantes/${userId}`);
  },

  getCursosAdmin: async () => {
    return apiFetch("/api/cursos/admin");
  },

  crearCurso: async (nombre) => {
    return apiFetch("/api/cursos", {
      method: "POST",
      body: JSON.stringify({ nombre }),
    });
  },

  eliminarCurso: async (id) => {
    return apiFetch(`/api/cursos/desactivar/${id}`, {
      method: "DELETE",
    });
  },

  inscribirUsuarioACurso: async (id_curso, id_usuario) => {
    return apiFetch("/api/cursos/inscribir", {
      method: "POST",
      body: JSON.stringify({ id_curso, id_usuario }),
    });
  },

  desinscribirUsuarioACurso: async (id_curso, id_usuario) => {
    return apiFetch("/api/cursos/desuscribir", {
      method: "DELETE",
      body: JSON.stringify({ id_curso, id_usuario }),
    });
  },

  editarCurso: async (id_curso, nombre, estado) => {
    return apiFetch(`/api/cursos/editar/${id_curso}`, {
      method: "PUT",
      body: JSON.stringify({ id_curso, nombre, estado }),
    });
  }
};
