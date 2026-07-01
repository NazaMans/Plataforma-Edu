import React, { useState, useEffect } from "react";
import { UserCog, X } from "lucide-react";
import { usuariosService } from "../../../../services/usuarios/usuarios.service.js";

function EditUserModal({ isOpen, onClose, user, onSuccess, onError }) {
  const [userForm, setUserForm] = useState({
    nombre: "",
    apellido: "",
    usuario: "",
    rol: "Estudiante",
    universidad: "UNLaR",
    numero: "",
    deuda: false,
    fecha_pago: "",
    estado: true
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setUserForm({
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        usuario: user.usuario || "",
        rol: user.rol || "Estudiante",
        universidad: user.universidad || "UNLaR",
        numero: user.numero || "",
        deuda: !!user.deuda,
        fecha_pago: user.fecha_pago ? new Date(user.fecha_pago).toISOString().split("T")[0] : "",
        estado: user.estado !== undefined ? !!user.estado : true
      });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userForm.nombre || !userForm.apellido || !userForm.usuario || !userForm.rol || !userForm.universidad) {
      onError("Completa los campos obligatorios.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...userForm,
        fecha_pago: userForm.fecha_pago ? userForm.fecha_pago : null
      };
      await usuariosService.editUser(user.id, payload);
      onSuccess("Usuario actualizado con éxito.");
      onClose();
    } catch (err) {
      console.error(err);
      onError(err.message || "Error al actualizar el usuario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-surf-lowest border border-surf-high rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-surf-high flex items-center justify-between">
          <h3 className="text-lg font-bold text-brand-light flex items-center gap-2">
            <UserCog className="w-5 h-5 text-accent-blue" />
            <span>Editar Usuario</span>
          </h3>
          <button
            onClick={onClose}
            className="text-brand-muted hover:text-brand-light transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[75vh] space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">
                Nombre *
              </label>
              <input
                type="text"
                required
                value={userForm.nombre}
                onChange={(e) => setUserForm({ ...userForm, nombre: e.target.value })}
                className="w-full bg-surf-low border-b border-surf-high focus:border-accent-blue text-white rounded-t-md p-2.5 text-sm outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">
                Apellido *
              </label>
              <input
                type="text"
                required
                value={userForm.apellido}
                onChange={(e) => setUserForm({ ...userForm, apellido: e.target.value })}
                className="w-full bg-surf-low border-b border-surf-high focus:border-accent-blue text-white rounded-t-md p-2.5 text-sm outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">
              Usuario (Email / ID) *
            </label>
            <input
              type="text"
              required
              value={userForm.usuario}
              onChange={(e) => setUserForm({ ...userForm, usuario: e.target.value })}
              className="w-full bg-surf-low border-b border-surf-high focus:border-accent-blue text-white rounded-t-md p-2.5 text-sm outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">
                Rol *
              </label>
              <select
                required
                value={userForm.rol}
                onChange={(e) => setUserForm({ ...userForm, rol: e.target.value })}
                className="w-full bg-surf-low border-b border-surf-high focus:border-accent-blue text-white rounded-t-md p-2.5 text-sm outline-none transition-colors"
              >
                <option value="Estudiante" className="bg-surf-lowest text-white">Estudiante</option>
                <option value="Profesor" className="bg-surf-lowest text-white">Profesor</option>
                <option value="Admin" className="bg-surf-lowest text-white">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">
                Universidad *
              </label>
              <select
                required
                value={userForm.universidad}
                onChange={(e) => setUserForm({ ...userForm, universidad: e.target.value })}
                className="w-full bg-surf-low border-b border-surf-high focus:border-accent-blue text-white rounded-t-md p-2.5 text-sm outline-none transition-colors"
              >
                <option value="UNLaR" className="bg-surf-lowest text-white">UNLaR</option>
                <option value="UTN" className="bg-surf-lowest text-white">UTN</option>
                <option value="Otra" className="bg-surf-lowest text-white">Otra</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">
              Número de Contacto
            </label>
            <input
              type="text"
              value={userForm.numero}
              onChange={(e) => setUserForm({ ...userForm, numero: e.target.value })}
              className="w-full bg-surf-low border-b border-surf-high focus:border-accent-blue text-white rounded-t-md p-2.5 text-sm outline-none transition-colors"
            />
          </div>

          {/* Deuda */}
          <div className="p-4 bg-surf-low rounded-lg flex items-center justify-between border border-surf-high">
            <div>
              <span className="block text-sm font-semibold text-brand-light">¿Posee Deuda?</span>
              <span className="text-xs text-brand-muted">Indica si tiene pagos pendientes</span>
            </div>
            <input
              type="checkbox"
              checked={userForm.deuda}
              onChange={(e) => setUserForm({ ...userForm, deuda: e.target.checked })}
              className="w-5 h-5 accent-accent-blue rounded focus:ring-0 cursor-pointer"
            />
          </div>

          {/* Fecha Pago */}
          <div>
            <label className="block text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">
              Fecha Límite / Último Pago
            </label>
            <input
              type="date"
              value={userForm.fecha_pago}
              onChange={(e) => setUserForm({ ...userForm, fecha_pago: e.target.value })}
              className="w-full bg-surf-low border-b border-surf-high focus:border-accent-blue text-white rounded-t-md p-2.5 text-sm outline-none transition-colors"
            />
          </div>

          {/* Estado Activo/Inactivo */}
          <div className="p-4 bg-surf-low rounded-lg flex items-center justify-between border border-surf-high">
            <div>
              <span className="block text-sm font-semibold text-brand-light">Estado Activo</span>
              <span className="text-xs text-brand-muted">Si está inactivo, no podrá ingresar a la plataforma</span>
            </div>
            <input
              type="checkbox"
              checked={userForm.estado}
              onChange={(e) => setUserForm({ ...userForm, estado: e.target.checked })}
              className="w-5 h-5 accent-accent-blue rounded focus:ring-0 cursor-pointer"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 bg-surf-low hover:bg-surf-high text-brand-light text-sm font-semibold rounded-lg transition-colors border border-surf-high disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-accent-darkblue hover:bg-accent-blue text-white text-sm font-semibold rounded-lg transition-colors shadow-md disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUserModal;
