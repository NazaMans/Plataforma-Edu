import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { apiFetch } from "../../services/api.js";
import { LogOut, BookOpen, ArrowRight, LayoutDashboard, Loader2 } from "lucide-react";

function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    
    const fetchCursos = async () => {
      try {
        setLoading(true);
        let data;
        if (user.rol === "Admin") {
          data = await apiFetch("/api/cursos/admin");
        } else {
          data = await apiFetch(`/api/cursos/estudiantes/${user.id_usuario}`);
        }
        setCursos(data.data || []);
      } catch (err) {
        console.error("Error al cargar cursos:", err);
        setError("No se pudieron cargar los cursos.");
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  if (!user) return null;

  const isAdmin = user.rol === "Admin";

  return (
    <div className="min-h-screen bg-brand-dark text-white font-sans flex flex-col">
      {/* Navigation Header */}
      <header className="w-full bg-surf-lowest border-b border-surf-high px-6 py-4 flex items-center justify-between z-10">
        <h1 className="text-2xl font-bold tracking-tight text-brand-light">Mansillas</h1>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white text-sm font-semibold rounded-lg transition-colors duration-200"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Ir al dashboard</span>
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-surf-low hover:bg-surf-high text-brand-light border border-surf-high hover:border-brand-muted text-sm font-semibold rounded-lg transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </header>

      {/* Main Content Pane */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 flex flex-col gap-10">
        {/* Welcome Section */}
        <section className="bg-surf-lowest border border-surf-high rounded-xl p-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[30vw] h-[30vw] rounded-full bg-accent-blue/5 blur-[80px] pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold text-brand-light">
              ¡Bienvenido, {user.nombre}!
            </h2>
            <p className="text-brand-muted text-sm mt-1">
              {isAdmin ? "Panel de control general de cursos y estudiantes." : "Aquí tienes acceso a tus cursos disponibles."}
            </p>
          </div>
        </section>

        {/* Courses Section */}
        <section className="flex flex-col gap-6">
          <h3 className="text-xl font-bold text-brand-light flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent-blue" />
            <span>Mis Cursos</span>
          </h3>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-8 h-8 text-accent-blue animate-spin" />
              <p className="text-brand-muted text-sm">Cargando cursos...</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-sm p-6 rounded-lg text-center">
              {error}
            </div>
          ) : cursos.length === 0 ? (
            <div className="bg-surf-lowest border border-surf-high rounded-xl p-12 text-center text-brand-muted">
              {isAdmin ? "No hay cursos creados en la plataforma." : "No estás inscrito en ningún curso actualmente."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cursos.map((curso) => (
                <div
                  key={curso.id}
                  className="bg-surf-lowest border border-surf-high rounded-xl p-6 flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div>
                    <h4 className="text-lg font-bold text-brand-light leading-snug mb-6">
                      {curso.nombre}
                    </h4>
                  </div>
                  <Link
                    to={`/cursos/${curso.id}`}
                    className="w-full py-3 bg-surf-low hover:bg-accent-darkblue border border-surf-high text-brand-light hover:text-white text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
                  >
                    <span>Entrar al curso</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Home;