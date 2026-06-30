import { apiFetch } from "../api.js";

export const usuariosService = {
  getUsers: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        params.append(key, val);
      }
    });
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiFetch(`/api/usuarios${query}`);
  },

  getUserById: async (id) => {
    return apiFetch(`/api/usuarios/${id}`);
  },

  registrarEstudiante: async (datos) => {
    return apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(datos),
    });
  },

  editUser: async (id, datos) => {
    return apiFetch(`/api/usuarios/${id}`, {
      method: "PUT",
      body: JSON.stringify(datos),
    });
  },

  deleteUser: async (id) => {
    return apiFetch(`/api/usuarios/${id}`, {
      method: "DELETE",
    });
  }
};
