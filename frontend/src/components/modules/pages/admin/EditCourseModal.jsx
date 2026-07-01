import React, { useState, useEffect } from "react";
import { Edit3, X, Check, BookOpen, PlusCircle, AlertCircle, Loader2 } from "lucide-react";
import { cursosService } from "../../../../services/cursos/cursos.service.js";
import { modulosService } from "../../../../services/modulos/modulos.service.js";
import { examenesService } from "../../../../services/examenes/examenes.service.js";

function EditCourseModal({
  isOpen,
  onClose,
  selectedCourse,
  onCourseUpdated,
  onEditModulo,
  onEditExamen,
  onAddContent,
  refreshTrigger
}) {
  const [courseModules, setCourseModules] = useState([]);
  const [courseExams, setCourseExams] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [editCourseForm, setEditCourseForm] = useState({
    nombre: "",
    estado: true
  });
  const [savingCourse, setSavingCourse] = useState(false);

  const refreshCourseDetails = async (courseId) => {
    setLoadingDetails(true);
    try {
      const [modulesRes, examsRes] = await Promise.all([
        modulosService.getModulosByCurso(courseId).catch(() => ({ data: [] })),
        examenesService.getExamenesPorCurso(courseId).catch(() => [])
      ]);
      setCourseModules(modulesRes.data || []);
      setCourseExams(Array.isArray(examsRes) ? examsRes : []);
    } catch (err) {
      console.error("Error al cargar detalles del curso:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    if (selectedCourse && isOpen) {
      setEditCourseForm({
        nombre: selectedCourse.nombre || "",
        estado: selectedCourse.estado !== undefined ? selectedCourse.estado : true
      });
      refreshCourseDetails(selectedCourse.id);
    }
  }, [selectedCourse, isOpen, refreshTrigger]);

  if (!isOpen || !selectedCourse) return null;

  const handleEditCourseSubmit = async (e) => {
    e.preventDefault();
    if (!editCourseForm.nombre) {
      return;
    }
    setSavingCourse(true);
    try {
      await cursosService.editarCurso(selectedCourse.id, editCourseForm.nombre, editCourseForm.estado);
      onCourseUpdated("Curso actualizado correctamente.");
    } catch (err) {
      console.error(err);
    } finally {
      setSavingCourse(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-40 overflow-y-auto">
      <div className="bg-surf-lowest border border-surf-high rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col my-8">
        <div className="px-6 py-4 border-b border-surf-high flex items-center justify-between">
          <h3 className="text-lg font-bold text-brand-light flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-accent-blue" />
            <span>Editar Curso: {selectedCourse.nombre}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-brand-muted hover:text-brand-light transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Course Info Form */}
          <form onSubmit={handleEditCourseSubmit} className="space-y-4 pb-6 border-b border-surf-high">
            <h4 className="text-sm font-bold text-brand-muted uppercase tracking-wider">
              Detalles del Curso
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">
                  Nombre del Curso *
                </label>
                <input
                  type="text"
                  required
                  value={editCourseForm.nombre}
                  onChange={(e) => setEditCourseForm({ ...editCourseForm, nombre: e.target.value })}
                  className="w-full bg-surf-low border-b border-surf-high focus:border-accent-blue text-white rounded-t-md p-2.5 text-sm outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">
                  Estado
                </label>
                <select
                  value={editCourseForm.estado}
                  onChange={(e) => setEditCourseForm({ ...editCourseForm, estado: e.target.value === "true" })}
                  className="w-full bg-surf-low border border-surf-high text-white rounded-md p-2.5 text-sm outline-none focus:border-accent-blue transition-colors"
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingCourse}
                className="py-2.5 px-5 bg-accent-darkblue hover:bg-accent-blue text-white text-xs font-semibold rounded-lg transition-colors shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{savingCourse ? "Guardando..." : "Guardar Cambios del Curso"}</span>
              </button>
            </div>
          </form>

          {/* Modules List */}
          <div className="space-y-4 pb-6 border-b border-surf-high">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-brand-muted uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-accent-blue" />
                <span>Módulos ({courseModules.length})</span>
              </h4>
              <button
                type="button"
                onClick={() => onAddContent(selectedCourse, "modulo")}
                className="py-1.5 px-3 bg-surf-low hover:bg-surf-high border border-surf-high text-brand-light text-xs font-semibold rounded-lg transition-colors duration-150 flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5 text-accent-blue" />
                <span>Agregar Módulo</span>
              </button>
            </div>

            {loadingDetails ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 text-accent-blue animate-spin" />
              </div>
            ) : courseModules.length === 0 ? (
              <p className="text-xs text-brand-muted italic bg-surf-low/30 p-4 rounded-lg border border-surf-high text-center">
                Este curso no tiene módulos asignados todavía.
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {courseModules.map((modulo) => (
                  <div
                    key={modulo.id}
                    className="p-3 bg-surf-low/40 border border-surf-high rounded-lg flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-brand-light truncate">
                        Módulo {modulo.numero}: {modulo.nombre || "Sin nombre"}
                      </p>
                      <p className="text-xs text-brand-muted truncate mt-0.5">
                        {modulo.teoria ? "Tiene Teoría" : "Sin Teoría"} • {modulo.practica ? "Tiene Práctica" : "Sin Práctica"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onEditModulo(modulo)}
                      className="py-1 px-2.5 bg-surf-low hover:bg-surf-high border border-surf-high text-brand-muted hover:text-brand-light text-xs font-semibold rounded transition-colors"
                    >
                      Editar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Exams List */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-brand-muted uppercase tracking-wider flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span>Exámenes ({courseExams.length})</span>
              </h4>
              <button
                type="button"
                onClick={() => onAddContent(selectedCourse, "examen")}
                className="py-1.5 px-3 bg-surf-low hover:bg-surf-high border border-surf-high text-brand-light text-xs font-semibold rounded-lg transition-colors duration-150 flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5 text-red-400" />
                <span>Agregar Examen</span>
              </button>
            </div>

            {loadingDetails ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 text-accent-blue animate-spin" />
              </div>
            ) : courseExams.length === 0 ? (
              <p className="text-xs text-brand-muted italic bg-surf-low/30 p-4 rounded-lg border border-surf-high text-center">
                Este curso no tiene exámenes asignados todavía.
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {courseExams.map((examen) => (
                  <div
                    key={examen.id}
                    className="p-3 bg-surf-low/40 border border-surf-high rounded-lg flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-brand-light truncate">
                        {examen.nombre}
                      </p>
                      <p className="text-xs text-brand-muted truncate mt-0.5">
                        {examen.actividad ? "Tiene Consigna" : "Sin Consigna"} • {examen.resolucion ? "Tiene Resolución" : "Sin Resolución"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onEditExamen(examen)}
                      className="py-1 px-2.5 bg-surf-low hover:bg-surf-high border border-surf-high text-brand-muted hover:text-brand-light text-xs font-semibold rounded transition-colors"
                    >
                      Editar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="px-6 py-4 bg-surf-low/50 border-t border-surf-high flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-6 bg-surf-low hover:bg-surf-high text-brand-light text-sm font-semibold border border-surf-high rounded-lg transition-colors duration-200"
          >
            Cerrar Editor
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditCourseModal;
