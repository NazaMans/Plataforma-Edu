import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import { usuariosService } from "../../../services/usuarios/usuarios.service.js";
import { cursosService } from "../../../services/cursos/cursos.service.js";
import { modulosService } from "../../../services/modulos/modulos.service.js";
import { examenesService } from "../../../services/examenes/examenes.service.js";
import { 
  Users, BookOpen, LogOut, PlusCircle, UserPlus, 
  Trash2, Edit3, X, ChevronRight, Check, AlertCircle, Loader2
} from "lucide-react";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Navigation State
  const [activeTab, setActiveTab] = useState("estudiantes"); // "estudiantes" | "cursos"
  
  // Data State
  const [estudiantes, setEstudiantes] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  
  // Modal / Form States
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false); // Modal for modules/exams
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  // Form Inputs
  const [userForm, setUserForm] = useState({
    usuario: "",
    password: "",
    nombre: "",
    apellido: "",
    rol: "Estudiante",
    universidad: "",
    numero: "",
    deuda: false,
    fecha_pago: ""
  });
  
  const [courseForm, setCourseForm] = useState({
    nombre: ""
  });
  
  const [contentForm, setContentForm] = useState({
    type: "modulo", // "modulo" | "examen"
    nombre: "",
    numero: "", // only for modules
    teoria: "", // only for modules
    practica: "", // only for modules
    actividad: "", // only for exams
    resolucion: "" // only for exams
  });
  
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  // Fetch Data on mount or tab change
  const fetchData = async () => {
    try {
      setLoadingData(true);
      const [usersRes, coursesRes] = await Promise.all([
        usuariosService.getUsers().catch(() => []),
        cursosService.getCursosAdmin().catch(() => ({ data: [] }))
      ]);
      
      // Filtrar sólo estudiantes en la lista de alumnos
      const studentsList = usersRes.filter(u => u.rol === "Estudiante" || u.rol === "Profesor");
      setEstudiantes(studentsList);
      setCursos(coursesRes.data || []);
    } catch (err) {
      console.error("Error al cargar datos del dashboard:", err);
      showStatus("error", "Error al cargar la información del servidor.");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (!user || user.rol !== "Admin") {
      navigate("/");
      return;
    }
    fetchData();
  }, [user]);

  const showStatus = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage({ type: "", text: "" }), 4000);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  // User Registration
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (!userForm.usuario || !userForm.password || !userForm.nombre || !userForm.apellido) {
      showStatus("error", "Completa los campos obligatorios del usuario.");
      return;
    }
    try {
      // Registrar usuario
      await usuariosService.registrarEstudiante(userForm);
      showStatus("success", "Usuario registrado exitosamente.");
      setShowUserModal(false);
      setUserForm({
        usuario: "",
        password: "",
        nombre: "",
        apellido: "",
        rol: "Estudiante",
        universidad: "",
        numero: "",
        deuda: false,
        fecha_pago: ""
      });
      fetchData();
    } catch (err) {
      console.error(err);
      showStatus("error", err.message || "Error al registrar usuario.");
    }
  };

  // Course Registration
  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    if (!courseForm.nombre) {
      showStatus("error", "El nombre del curso es obligatorio.");
      return;
    }
    try {
      await cursosService.crearCurso(courseForm.nombre);
      showStatus("success", "Curso creado exitosamente.");
      setShowCourseModal(false);
      setCourseForm({ nombre: "" });
      fetchData();
    } catch (err) {
      console.error(err);
      showStatus("error", err.message || "Error al crear curso.");
    }
  };

  // Delete Course
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("¿Estás seguro de que deseas desactivar/eliminar este curso?")) return;
    try {
      await cursosService.eliminarCurso(courseId);
      showStatus("success", "Curso eliminado.");
      fetchData();
    } catch (err) {
      console.error(err);
      showStatus("error", err.message || "Error al eliminar curso.");
    }
  };

  // Module / Exam Creation
  const handleContentSubmit = async (e) => {
    e.preventDefault();
    if (!contentForm.nombre) {
      showStatus("error", "El nombre es obligatorio.");
      return;
    }
    try {
      if (contentForm.type === "modulo") {
        await modulosService.crearModulo({
          nombre: contentForm.nombre,
          numero: parseInt(contentForm.numero, 10) || 1,
          teoria: contentForm.teoria,
          practica: contentForm.practica,
          id_curso: selectedCourse.id
        });
        showStatus("success", "Módulo agregado al curso.");
      } else {
        await examenesService.crearExamen({
          curso_id: selectedCourse.id,
          nombre: contentForm.nombre,
          actividad: contentForm.actividad,
          resolucion: contentForm.resolucion
        });
        showStatus("success", "Examen agregado al curso.");
      }
      setShowContentModal(false);
      setContentForm({
        type: "modulo",
        nombre: "",
        numero: "",
        teoria: "",
        practica: "",
        actividad: "",
        resolucion: ""
      });
    } catch (err) {
      console.error(err);
      showStatus("error", err.message || "Error al agregar contenido.");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-brand-dark text-white font-sans flex flex-col">
      {/* Header */}
      <header className="w-full bg-surf-lowest border-b border-surf-high px-6 py-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-brand-light">Mansillas</h1>
          <span className="text-xs py-1 px-2.5 bg-accent-darkblue/40 border border-accent-blue/30 text-accent-blue rounded font-bold uppercase tracking-wider">
            Administrador
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="text-brand-muted hover:text-brand-light text-sm font-semibold transition-colors duration-200"
          >
            Página principal
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-surf-low hover:bg-surf-high text-brand-light border border-surf-high text-sm font-semibold rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </header>

      {/* Body Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Admin Left Sidebar */}
        <aside className="w-80 bg-surf-lowest border-r border-surf-high flex flex-col justify-between p-6">
          <div className="flex flex-col gap-8">
            {/* Welcome banner for admin with their name and nothing else */}
            <div className="py-2 border-b border-surf-high">
              <h2 className="text-xl font-bold text-brand-light">
                ¡Bienvenido/a, {user.nombre}!
              </h2>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setActiveTab("estudiantes")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                  activeTab === "estudiantes"
                    ? "bg-accent-darkblue text-white"
                    : "hover:bg-surf-low text-brand-muted hover:text-brand-light"
                }`}
              >
                <Users className="w-5 h-5" />
                <span>Estudiantes</span>
              </button>
              <button
                onClick={() => setActiveTab("cursos")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                  activeTab === "cursos"
                    ? "bg-accent-darkblue text-white"
                    : "hover:bg-surf-low text-brand-muted hover:text-brand-light"
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span>Cursos</span>
              </button>
            </div>
          </div>

          {/* Persistent Action Buttons in Navbar Bottom */}
          <div className="flex flex-col gap-2 pt-6 border-t border-surf-high">
            <button
              onClick={() => setShowCourseModal(true)}
              className="w-full py-3 bg-surf-low hover:bg-surf-high border border-surf-high hover:border-brand-muted text-brand-light text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-200"
            >
              <PlusCircle className="w-4 h-4 text-accent-blue" />
              <span>Crear curso</span>
            </button>
            <button
              onClick={() => setShowUserModal(true)}
              className="w-full py-3 bg-accent-darkblue hover:bg-accent-blue text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md shadow-accent-darkblue/20"
            >
              <UserPlus className="w-4 h-4" />
              <span>Registrar usuario</span>
            </button>
          </div>
        </aside>

        {/* Dashboard Panels */}
        <main className="flex-1 bg-brand-dark overflow-y-auto p-8">
          {statusMessage.text && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center gap-2 text-sm border ${
                statusMessage.type === "success"
                  ? "bg-green-500/10 border-green-500/20 text-green-200"
                  : "bg-red-500/10 border-red-500/20 text-red-200"
              }`}
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{statusMessage.text}</span>
            </div>
          )}

          {loadingData ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 text-accent-blue animate-spin" />
              <p className="text-brand-muted text-sm">Cargando información...</p>
            </div>
          ) : activeTab === "estudiantes" ? (
            // STUDENTS MANAGEMENT TAB
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-brand-light">Directorio de Estudiantes</h3>
              </div>

              {estudiantes.length === 0 ? (
                <div className="bg-surf-lowest border border-surf-high rounded-xl p-12 text-center text-brand-muted">
                  No hay estudiantes registrados.
                </div>
              ) : (
                <div className="bg-surf-lowest border border-surf-high rounded-xl overflow-hidden shadow-md">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surf-low/50 border-b border-surf-high text-brand-muted text-xs font-bold uppercase tracking-wider">
                        <th className="py-4 px-6">Estudiante</th>
                        <th className="py-4 px-6">Usuario/Email</th>
                        <th className="py-4 px-6">Universidad</th>
                        <th className="py-4 px-6">Teléfono</th>
                        <th className="py-4 px-6">Estado Deuda</th>
                        <th className="py-4 px-6">Último Pago</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surf-high text-sm text-brand-light">
                      {estudiantes.map((estudiante) => (
                        <tr key={estudiante.id} className="hover:bg-surf-low/20 transition-colors duration-150">
                          <td className="py-4 px-6 font-bold">
                            {estudiante.nombre} {estudiante.apellido}
                          </td>
                          <td className="py-4 px-6 text-brand-muted">{estudiante.usuario}</td>
                          <td className="py-4 px-6">{estudiante.universidad || "—"}</td>
                          <td className="py-4 px-6">{estudiante.numero || "—"}</td>
                          <td className="py-4 px-6">
                            {estudiante.deuda ? (
                              <span className="py-1 px-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-md">
                                Deuda
                              </span>
                            ) : (
                              <span className="py-1 px-2.5 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold rounded-md">
                                Al día
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-brand-muted">
                            {estudiante.fecha_pago
                              ? new Date(estudiante.fecha_pago).toLocaleDateString()
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            // COURSES MANAGEMENT TAB
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-brand-light">Gestión de Cursos</h3>
              </div>

              {cursos.length === 0 ? (
                <div className="bg-surf-lowest border border-surf-high rounded-xl p-12 text-center text-brand-muted">
                  No hay cursos creados en la plataforma.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cursos.map((curso) => (
                    <div
                      key={curso.id}
                      className="bg-surf-lowest border border-surf-high rounded-xl p-6 flex flex-col justify-between gap-6 shadow-md"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-bold text-brand-light leading-snug">
                            {curso.nombre}
                          </h4>
                          <span className={`inline-block mt-2 text-xs py-0.5 px-2 rounded font-semibold ${
                            curso.estado ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}>
                            {curso.estado ? "Activo" : "Inactivo"}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteCourse(curso.id)}
                          className="p-2 bg-surf-low hover:bg-red-500/10 border border-surf-high hover:border-red-500/20 text-brand-muted hover:text-red-400 rounded-lg transition-colors duration-200"
                          title="Desactivar curso"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedCourse(curso);
                            setContentForm(prev => ({ ...prev, type: "modulo" }));
                            setShowContentModal(true);
                          }}
                          className="flex-1 py-2 bg-surf-low hover:bg-surf-high border border-surf-high text-brand-light text-xs font-semibold rounded-lg transition-colors duration-150 flex items-center justify-center gap-1.5"
                        >
                          <PlusCircle className="w-3.5 h-3.5 text-accent-blue" />
                          <span>Agregar Módulo</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCourse(curso);
                            setContentForm(prev => ({ ...prev, type: "examen" }));
                            setShowContentModal(true);
                          }}
                          className="flex-1 py-2 bg-surf-low hover:bg-surf-high border border-surf-high text-brand-light text-xs font-semibold rounded-lg transition-colors duration-150 flex items-center justify-center gap-1.5"
                        >
                          <PlusCircle className="w-3.5 h-3.5 text-red-400" />
                          <span>Agregar Examen</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* USER REGISTRATION MODAL */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-surf-lowest border border-surf-high rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-surf-high flex items-center justify-between">
              <h3 className="text-lg font-bold text-brand-light flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-accent-blue" />
                <span>Registrar Nuevo Estudiante</span>
              </h3>
              <button
                onClick={() => setShowUserModal(false)}
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
                  type="password"
                  required
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  className="w-full bg-surf-low border-b border-surf-high focus:border-accent-blue text-white rounded-t-md p-2.5 text-sm outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">
                    Universidad
                  </label>
                  <input
                    type="text"
                    value={userForm.universidad}
                    onChange={(e) => setUserForm({ ...userForm, universidad: e.target.value })}
                    className="w-full bg-surf-low border-b border-surf-high focus:border-accent-blue text-white rounded-t-md p-2.5 text-sm outline-none transition-colors"
                  />
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
              </div>

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

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 py-3 bg-surf-low hover:bg-surf-high text-brand-light text-sm font-semibold rounded-lg transition-colors border border-surf-high"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-accent-darkblue hover:bg-accent-blue text-white text-sm font-semibold rounded-lg transition-colors shadow-md"
                >
                  Confirmar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COURSE CREATION MODAL */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-surf-lowest border border-surf-high rounded-xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-surf-high flex items-center justify-between">
              <h3 className="text-lg font-bold text-brand-light flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-accent-blue" />
                <span>Crear Nuevo Curso</span>
              </h3>
              <button
                onClick={() => setShowCourseModal(false)}
                className="text-brand-muted hover:text-brand-light transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCourseSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">
                  Nombre del Curso *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Programación Web II"
                  value={courseForm.nombre}
                  onChange={(e) => setCourseForm({ ...courseForm, nombre: e.target.value })}
                  className="w-full bg-surf-low border-b border-surf-high focus:border-accent-blue text-white rounded-t-md p-2.5 text-sm outline-none transition-colors"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="flex-1 py-3 bg-surf-low hover:bg-surf-high text-brand-light text-sm font-semibold rounded-lg transition-colors border border-surf-high"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-accent-darkblue hover:bg-accent-blue text-white text-sm font-semibold rounded-lg transition-colors shadow-md"
                >
                  Crear Curso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODULE / EXAM CONTENT ADDITION MODAL */}
      {showContentModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-surf-lowest border border-surf-high rounded-xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-surf-high flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-brand-light">
                  Agregar Contenido a: {selectedCourse.nombre}
                </h3>
              </div>
              <button
                onClick={() => setShowContentModal(false)}
                className="text-brand-muted hover:text-brand-light transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleContentSubmit} className="p-6 overflow-y-auto max-h-[75vh] space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">
                  Tipo de Contenido
                </label>
                <div className="flex bg-surf-low p-1 rounded-lg border border-surf-high">
                  <button
                    type="button"
                    onClick={() => setContentForm(prev => ({ ...prev, type: "modulo" }))}
                    className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                      contentForm.type === "modulo"
                        ? "bg-accent-darkblue text-white shadow-sm"
                        : "text-brand-muted hover:text-brand-light"
                    }`}
                  >
                    Módulo
                  </button>
                  <button
                    type="button"
                    onClick={() => setContentForm(prev => ({ ...prev, type: "examen" }))}
                    className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                      contentForm.type === "examen"
                        ? "bg-accent-darkblue text-white shadow-sm"
                        : "text-brand-muted hover:text-brand-light"
                    }`}
                  >
                    Examen / Solapa
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  placeholder={contentForm.type === "modulo" ? "Ej: Introducción a React" : "Ej: Examen Parcial I"}
                  value={contentForm.nombre}
                  onChange={(e) => setContentForm({ ...contentForm, nombre: e.target.value })}
                  className="w-full bg-surf-low border-b border-surf-high focus:border-accent-blue text-white rounded-t-md p-2.5 text-sm outline-none transition-colors"
                />
              </div>

              {contentForm.type === "modulo" ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">
                      Número de Módulo (Orden)
                    </label>
                    <input
                      type="number"
                      placeholder="1"
                      value={contentForm.numero}
                      onChange={(e) => setContentForm({ ...contentForm, numero: e.target.value })}
                      className="w-full bg-surf-low border-b border-surf-high focus:border-accent-blue text-white rounded-t-md p-2.5 text-sm outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">
                      Contenido Teórico (Texto o Enlace PDF)
                    </label>
                    <textarea
                      placeholder="Escribe la teoría o pega un enlace a un archivo..."
                      value={contentForm.teoria}
                      onChange={(e) => setContentForm({ ...contentForm, teoria: e.target.value })}
                      rows="3"
                      className="w-full bg-surf-low border border-surf-high focus:border-accent-blue text-white rounded-lg p-2.5 text-sm outline-none transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">
                      Contenido Práctico (Texto o Enlace Ejercicios)
                    </label>
                    <textarea
                      placeholder="Escribe la práctica o pega un enlace..."
                      value={contentForm.practica}
                      onChange={(e) => setContentForm({ ...contentForm, practica: e.target.value })}
                      rows="3"
                      className="w-full bg-surf-low border border-surf-high focus:border-accent-blue text-white rounded-lg p-2.5 text-sm outline-none transition-colors resize-none"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">
                      Consigna del Examen (Texto o Enlace PDF)
                    </label>
                    <textarea
                      placeholder="Escribe la consigna o pega un enlace..."
                      value={contentForm.actividad}
                      onChange={(e) => setContentForm({ ...contentForm, actividad: e.target.value })}
                      rows="3"
                      className="w-full bg-surf-low border border-surf-high focus:border-accent-blue text-white rounded-lg p-2.5 text-sm outline-none transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">
                      Resolución / Respuestas (Opcional, Texto o Enlace)
                    </label>
                    <textarea
                      placeholder="Guía de respuestas..."
                      value={contentForm.resolucion}
                      onChange={(e) => setContentForm({ ...contentForm, resolucion: e.target.value })}
                      rows="3"
                      className="w-full bg-surf-low border border-surf-high focus:border-accent-blue text-white rounded-lg p-2.5 text-sm outline-none transition-colors resize-none"
                    />
                  </div>
                </>
              )}

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowContentModal(false)}
                  className="flex-1 py-3 bg-surf-low hover:bg-surf-high text-brand-light text-sm font-semibold rounded-lg transition-colors border border-surf-high"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-accent-darkblue hover:bg-accent-blue text-white text-sm font-semibold rounded-lg transition-colors shadow-md"
                >
                  Guardar Contenido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
