import React, { useState, useEffect } from "react";
import { UserPlus, X, Copy, Check, Key, User, CheckCircle2 } from "lucide-react";
import { usuariosService } from "../../../../services/usuarios/usuarios.service.js";

function UserModal({ isOpen, onClose, onSuccess, onError }) {
  const [userForm, setUserForm] = useState({
    usuario: "",
    password: "",
    nombre: "",
    apellido: "",
    rol: "Estudiante",
    universidad: "UNLaR",
    numero: ""
  });

  const [loading, setLoading] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [copiedUsuario, setCopiedUsuario] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCreatedCredentials(null);
      setCopiedUsuario(false);
      setCopiedPassword(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "usuario") {
        setCopiedUsuario(true);
        setTimeout(() => setCopiedUsuario(false), 2000);
      } else {
        setCopiedPassword(true);
        setTimeout(() => setCopiedPassword(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (!userForm.usuario || !userForm.password || !userForm.nombre || !userForm.apellido || !userForm.rol || !userForm.universidad) {
      onError("Completa los campos obligatorios del usuario.");
      return;
    }
    setLoading(false);
    try {
      setLoading(true);
      await usuariosService.registrarEstudiante(userForm);
      onSuccess("Usuario registrado exitosamente.");
      
      setCreatedCredentials({
        usuario: userForm.usuario,
        password: userForm.password,
        nombre: `${userForm.nombre} ${userForm.apellido}`,
        rol: userForm.rol
      });

      setUserForm({
        usuario: "",
        password: "",
        nombre: "",
        apellido: "",
        rol: "Estudiante",
        universidad: "UNLaR",
        numero: ""
      });
    } catch (err) {
      console.error(err);
      onError(err.message || "Error al registrar usuario.");
    } finally {
      setLoading(false);
    }
  };

  if (createdCredentials) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
        <div className="bg-surf-lowest border border-surf-high rounded-xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col transform transition-all scale-100">
          <div className="px-6 py-4 border-b border-surf-high flex items-center justify-between">
            <h3 className="text-lg font-bold text-brand-light flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />
              <span>Registro Exitoso</span>
            </h3>
            <button
              onClick={() => {
                setCreatedCredentials(null);
                onClose();
              }}
              className="text-brand-muted hover:text-brand-light transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-brand-muted">
              El {createdCredentials.rol.toLowerCase()} ha sido registrado correctamente. Aquí están las credenciales de acceso para <strong>{createdCredentials.nombre}</strong>:
            </p>
            
            <div className="space-y-3 bg-surf-low p-4 rounded-lg border border-surf-high">
              <div className="space-y-1">
                <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block">
                  Usuario / Email
                </span>
                <div className="flex items-center justify-between bg-surf-lowest px-3 py-2 rounded border border-surf-high">
                  <div className="flex items-center gap-2 overflow-hidden mr-2">
                    <User className="w-4 h-4 text-accent-blue flex-shrink-0" />
                    <span className="text-white text-sm select-all truncate">
                      {createdCredentials.usuario}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(createdCredentials.usuario, "usuario")}
                    className="p-1.5 hover:bg-surf-high rounded text-brand-muted hover:text-white transition-colors flex-shrink-0 cursor-pointer"
                    title="Copiar usuario"
                  >
                    {copiedUsuario ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-brand-muted uppercase tracking-wider block">
                  Contraseña
                </span>
                <div className="flex items-center justify-between bg-surf-lowest px-3 py-2 rounded border border-surf-high">
                  <div className="flex items-center gap-2 overflow-hidden mr-2">
                    <Key className="w-4 h-4 text-accent-blue flex-shrink-0" />
                    <span className="text-white text-sm select-all font-mono truncate">
                      {createdCredentials.password}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(createdCredentials.password, "password")}
                    className="p-1.5 hover:bg-surf-high rounded text-brand-muted hover:text-white transition-colors flex-shrink-0 cursor-pointer"
                    title="Copiar contraseña"
                  >
                    {copiedPassword ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs p-3 rounded-lg flex gap-2">
              <span className="font-bold flex-shrink-0">⚠️ Importante:</span>
              <span>
                Asegúrate de copiar y guardar estas credenciales ahora. Por seguridad, no se volverán a mostrar de esta forma.
              </span>
            </div>

            <button
              onClick={() => {
                setCreatedCredentials(null);
                onClose();
              }}
              className="w-full py-3 bg-accent-darkblue hover:bg-accent-blue text-white text-sm font-semibold rounded-lg transition-colors shadow-md mt-2 cursor-pointer"
            >
              Entendido / Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-surf-lowest border border-surf-high rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-surf-high flex items-center justify-between">
          <h3 className="text-lg font-bold text-brand-light flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-accent-blue" />
            <span>Registrar Nuevo Estudiante</span>
          </h3>
          <button
            onClick={onClose}
            className="text-brand-muted hover:text-brand-light transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleUserSubmit} className="p-6 overflow-y-auto max-h-[75vh] space-y-4">
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

          <div>
            <label className="block text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">
              Contraseña Temporal *
            </label>
            <input
              required
              value={userForm.password}
              onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
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
              {loading ? "Registrando..." : "Confirmar Registro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default UserModal;
