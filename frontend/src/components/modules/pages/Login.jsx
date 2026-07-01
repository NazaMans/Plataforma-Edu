import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import { User, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to home if user is already authenticated
  useEffect(() => {
    if (!loading && user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuario.trim() || !password.trim()) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await login({ usuario, password });
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Error durante el inicio de sesión:", err);
      setError(err.message || "Usuario o contraseña incorrectos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 text-sm animate-pulse">Cargando sesión...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4 py-12 relative overflow-hidden font-sans">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-accent-blue/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-accent-darkblue/5 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-surf-lowest border border-surf-high rounded-2xl p-8 shadow-xl relative z-10">
        <div className="mb-8 flex flex-col items-center">
          <img src="/iconoIA.png" alt="Mansillas Logo" className="w-16 h-16 mb-4 rounded-xl shadow-lg border border-surf-high" />
          <h1 className="text-3xl font-extrabold text-brand-light tracking-tight">
            Mansillas
          </h1>
          <p className="text-brand-muted text-sm mt-2 font-medium">
            Inicie sesión
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-sm p-4 rounded-lg mb-6 flex items-start gap-3 animate-pulse">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-brand-muted text-xs font-bold uppercase tracking-wider mb-2">
              Usuario
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted">
                <User className="w-5 h-5" />
              </span>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Ingresa tu usuario"
                disabled={isSubmitting}
                className="w-full bg-surf-low border-b border-surf-high focus:border-accent-blue focus:ring-0 text-white rounded-t-lg py-3.5 pl-12 pr-4 transition-all duration-300 outline-none text-sm placeholder-brand-muted"
              />
            </div>
          </div>

          <div>
            <label className="block text-brand-muted text-xs font-bold uppercase tracking-wider mb-2">
              Contraseña
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isSubmitting}
                className="w-full bg-surf-low border-b border-surf-high focus:border-accent-blue focus:ring-0 text-white rounded-t-lg py-3.5 pl-12 pr-12 transition-all duration-300 outline-none text-sm placeholder-brand-muted"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-light transition-colors duration-200"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-accent-darkblue hover:bg-accent-blue text-white font-semibold rounded-lg shadow-lg shadow-accent-darkblue/20 transition-all duration-300 active:scale-[0.98] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Iniciando sesión...</span>
              </>
            ) : (
              <>
                <span>Ingresar</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;