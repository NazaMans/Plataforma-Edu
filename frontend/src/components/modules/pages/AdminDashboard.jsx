import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import { usuariosService } from "../../../services/usuarios/usuarios.service.js";
import { cursosService } from "../../../services/cursos/cursos.service.js";
import { LogOut, AlertCircle, Loader2 } from "lucide-react";

// Subcomponentes modulares
import AdminSidebar from "./admin/AdminSidebar.jsx";
import EstudiantesTable from "./admin/EstudiantesTable.jsx";
import CursosSection from "./admin/CursosSection.jsx";
import UserModal from "./admin/UserModal.jsx";
import CourseModal from "./admin/CourseModal.jsx";
import ContentModal from "./admin/ContentModal.jsx";
import EditCourseModal from "./admin/EditCourseModal.jsx";
import EditUserModal from "./admin/EditUserModal.jsx";
import UserCoursesModal from "./admin/UserCoursesModal.jsx";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Navigation State
  const [activeTab, setActiveTab] = useState("estudiantes"); // "estudiantes" | "cursos"
  
  // Data State
  const [estudiantes, setEstudiantes] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  
  // Modal states
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [showEditCourseModal, setShowEditCourseModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showUserCoursesModal, setShowUserCoursesModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Selected items & Reactivity
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editingContent, setEditingContent] = useState(null);
  const [detailsRefreshTrigger, setDetailsRefreshTrigger] = useState(0);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const fetchData = async () => {
    try {
      setLoadingData(true);
      const [usersRes, coursesRes] = await Promise.all([
        usuariosService.getUsers().catch(() => []),
        cursosService.getCursosAdmin().catch(() => ({ data: [] }))
      ]);
      
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

  const handleOpenEditCourse = (curso) => {
    setSelectedCourse(curso);
    setShowEditCourseModal(true);
  };

  const handleOpenAddContent = (curso, type) => {
    setSelectedCourse(curso);
    setEditingContent(null);
    setShowContentModal(true);
  };

  const handleOpenEditModulo = (modulo) => {
    setEditingContent({ ...modulo, type: "modulo" });
    setShowContentModal(true);
  };

  const handleOpenEditExamen = (examen) => {
    setEditingContent({ ...examen, type: "examen" });
    setShowContentModal(true);
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
        {/* Sidebar */}
        <AdminSidebar
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenCourseModal={() => setShowCourseModal(true)}
          onOpenUserModal={() => setShowUserModal(true)}
        />

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
            <EstudiantesTable
              estudiantes={estudiantes}
              onEditUser={(estudiante) => {
                setSelectedUser(estudiante);
                setShowEditUserModal(true);
              }}
              onManageCourses={(estudiante) => {
                setSelectedUser(estudiante);
                setShowUserCoursesModal(true);
              }}
            />
          ) : (
            <CursosSection
              cursos={cursos}
              onEditCourse={handleOpenEditCourse}
              onDeleteCourse={handleDeleteCourse}
              onAddContent={handleOpenAddContent}
            />
          )}
        </main>
      </div>

      {/* MODALS */}
      <UserModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        onSuccess={(msg) => {
          showStatus("success", msg);
          fetchData();
        }}
        onError={(msg) => showStatus("error", msg)}
      />

      <CourseModal
        isOpen={showCourseModal}
        onClose={() => setShowCourseModal(false)}
        onSuccess={(msg) => {
          showStatus("success", msg);
          fetchData();
        }}
        onError={(msg) => showStatus("error", msg)}
      />

      <EditCourseModal
        isOpen={showEditCourseModal}
        onClose={() => setShowEditCourseModal(false)}
        selectedCourse={selectedCourse}
        onCourseUpdated={(msg) => {
          showStatus("success", msg);
          fetchData();
        }}
        onEditModulo={handleOpenEditModulo}
        onEditExamen={handleOpenEditExamen}
        onAddContent={handleOpenAddContent}
        refreshTrigger={detailsRefreshTrigger}
      />

      <ContentModal
        isOpen={showContentModal}
        onClose={() => setShowContentModal(false)}
        selectedCourse={selectedCourse}
        editingContent={editingContent}
        onSuccess={(msg) => {
          showStatus("success", msg);
          setDetailsRefreshTrigger(prev => prev + 1);
        }}
        onError={(msg) => showStatus("error", msg)}
      />

      <EditUserModal
        isOpen={showEditUserModal}
        onClose={() => {
          setShowEditUserModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSuccess={(msg) => {
          showStatus("success", msg);
          fetchData();
        }}
        onError={(msg) => showStatus("error", msg)}
      />

      <UserCoursesModal
        isOpen={showUserCoursesModal}
        onClose={() => {
          setShowUserCoursesModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        allCourses={cursos}
        onSuccess={(msg) => {
          showStatus("success", msg);
          fetchData();
        }}
        onError={(msg) => showStatus("error", msg)}
      />
    </div>
  );
}

export default AdminDashboard;
