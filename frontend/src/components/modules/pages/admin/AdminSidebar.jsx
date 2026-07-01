import React from "react";
import { Users, BookOpen, PlusCircle, UserPlus } from "lucide-react";

function AdminSidebar({ user, activeTab, setActiveTab, onOpenCourseModal, onOpenUserModal }) {
  if (!user) return null;

  return (
    <aside className="w-80 bg-surf-lowest border-r border-surf-high flex flex-col justify-between p-6">
      <div className="flex flex-col gap-8">
        {/* Welcome banner for admin with their name */}
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

      {/* Persistent Action Buttons in Sidebar Bottom */}
      <div className="flex flex-col gap-2 pt-6 border-t border-surf-high">
        <button
          onClick={onOpenCourseModal}
          className="w-full py-3 bg-surf-low hover:bg-surf-high border border-surf-high hover:border-brand-muted text-brand-light text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-200"
        >
          <PlusCircle className="w-4 h-4 text-accent-blue" />
          <span>Crear curso</span>
        </button>
        <button
          onClick={onOpenUserModal}
          className="w-full py-3 bg-accent-darkblue hover:bg-accent-blue text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md shadow-accent-darkblue/20"
        >
          <UserPlus className="w-4 h-4" />
          <span>Registrar usuario</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
