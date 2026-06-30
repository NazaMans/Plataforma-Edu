import { apiFetch } from "../api.js";

export const authService = {
  login: async (credenciales) => {
    return apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credenciales),
    });
  },

  logout: async () => {
    return apiFetch("/api/auth/logout", {
      method: "POST",
    });
  },

  getSession: async () => {
    return apiFetch("/api/auth/session");
  }
};
