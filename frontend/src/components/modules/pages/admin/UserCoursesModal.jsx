import React, { useState, useEffect } from "react";
import { BookOpen, Plus, Trash2, X, Loader2 } from "lucide-react";
import { cursosService } from "../../../../services/cursos/cursos.service.js";

function UserCoursesModal({ isOpen, onClose, user, allCourses = [], onSuccess, onError }) {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const fetchEnrolledCourses = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await cursosService.getCursosParaEstudiantes(user.id);
      // Soportar si viene envuelto en { data: ... } o directo
      const list = res.data || res || [];
      setEnrolledCourses(list);
    } catch (err) {
      console.error(err);
      onError("Error al obtener los cursos del estudiante.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchEnrolledCourses();
      setSelectedCourseId("");
    }
  }, [isOpen, user]);

  // Filtrar cursos en los que el estudiante NO está inscrito y que estén activos
  const availableCourses = allCourses.filter((course) => {
    const isEnrolled = enrolledCourses.some((ec) => ec.id === course.id);
    const isActive = course.estado !== false;
    return !isEnrolled && isActive;
  });

  // Autoseleccionar primer curso disponible al cambiar
  useEffect(() => {
    if (availableCourses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(availableCourses[0].id.toString());
    } else if (availableCourses.length === 0) {
      setSelectedCourseId("");
    }
  }, [availableCourses, selectedCourseId]);

  if (!isOpen) return null;

  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) return;

    try {
      setActionLoading(true);
      await cursosService.inscribirUsuarioACurso(parseInt(selectedCourseId, 10), user.id);
      onSuccess("Estudiante inscrito en el curso exitosamente.");
      // Limpiar selección y recargar
      setSelectedCourseId("");
      await fetchEnrolledCourses();
    } catch (err) {
      console.error(err);
      onError(err.message || "Error al inscribir al estudiante.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnenroll = async (courseId) => {
    if (!window.confirm("¿Seguro que deseas desinscribir al estudiante de este curso?")) return;

    try {
      setActionLoading(true);
      await cursosService.desinscribirUsuarioACurso(courseId, user.id);
      onSuccess("Estudiante desinscrito del curso exitosamente.");
      await fetchEnrolledCourses();
    } catch (err) {
      console.error(err);
      onError(err.message || "Error al desinscribir al estudiante.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-surf-lowest border border-surf-high rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-surf-high flex items-center justify-between">
          <h3 className="text-lg font-bold text-brand-light flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent-blue" />
            <span>Cursos de {user?.nombre} {user?.apellido}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-brand-muted hover:text-brand-light transition-colors duration-200"
            disabled={actionLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Inscripción a nuevo curso */}
          <div className="bg-surf-low/40 p-4 border border-surf-high rounded-xl">
            <h4 className="text-sm font-bold text-brand-light mb-3">Inscribir en un nuevo curso</h4>
            {availableCourses.length === 0 ? (
              <p className="text-xs text-brand-muted">
                El estudiante ya está inscrito en todos los cursos activos disponibles.
              </p>
            ) : (
              <form onSubmit={handleEnroll} className="flex gap-2">
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="flex-1 bg-surf-low border border-surf-high focus:border-accent-blue text-white rounded-lg p-2.5 text-sm outline-none transition-colors"
                  disabled={actionLoading}
                >
                  {availableCourses.map((course) => (
                    <option key={course.id} value={course.id} className="bg-surf-lowest text-white">
                      {course.nombre}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={actionLoading || !selectedCourseId}
                  className="px-4 py-2.5 bg-accent-darkblue hover:bg-accent-blue text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span>Inscribir</span>
                </button>
              </form>
            )}
          </div>

          {/* Listado de cursos actuales */}
          <div>
            <h4 className="text-sm font-bold text-brand-light mb-3">Cursos inscritos</h4>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <Loader2 className="w-6 h-6 text-accent-blue animate-spin" />
                <p className="text-xs text-brand-muted">Cargando inscripciones...</p>
              </div>
            ) : enrolledCourses.length === 0 ? (
              <div className="border border-dashed border-surf-high rounded-xl p-8 text-center text-xs text-brand-muted">
                Este estudiante no está inscrito en ningún curso.
              </div>
            ) : (
              <div className="space-y-2">
                {enrolledCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-3 bg-surf-low/65 border border-surf-high rounded-lg hover:border-surf-high/80 transition-colors"
                  >
                    <div>
                      <span className="text-sm font-semibold text-brand-light">{course.nombre}</span>
                      <span className="block text-[10px] text-brand-muted uppercase tracking-wider mt-0.5">
                        {course.estado ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                    <button
                      onClick={() => handleUnenroll(course.id)}
                      disabled={actionLoading}
                      title="Desinscribir del curso"
                      className="p-2 text-brand-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-surf-high bg-surf-low/20 flex justify-end">
          <button
            onClick={onClose}
            disabled={actionLoading}
            className="px-6 py-2.5 bg-surf-low hover:bg-surf-high text-brand-light text-sm font-semibold rounded-lg transition-colors border border-surf-high disabled:opacity-50"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}

export default UserCoursesModal;
