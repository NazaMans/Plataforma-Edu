import React, { useState } from "react";
import { PlusCircle, X } from "lucide-react";
import { cursosService } from "../../../../services/cursos/cursos.service.js";

function CourseModal({ isOpen, onClose, onSuccess, onError }) {
  const [courseForm, setCourseForm] = useState({
    nombre: ""
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    if (!courseForm.nombre) {
      onError("El nombre del curso es obligatorio.");
      return;
    }
    setLoading(true);
    try {
      await cursosService.crearCurso(courseForm.nombre);
      onSuccess("Curso creado exitosamente.");
      setCourseForm({ nombre: "" });
      onClose();
    } catch (err) {
      console.error(err);
      onError(err.message || "Error al crear curso.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-surf-lowest border border-surf-high rounded-xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-surf-high flex items-center justify-between">
          <h3 className="text-lg font-bold text-brand-light flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-accent-blue" />
            <span>Crear Nuevo Curso</span>
          </h3>
          <button
            onClick={onClose}
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
              onChange={(e) => setCourseForm({ nombre: e.target.value })}
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
              {loading ? "Creando..." : "Crear Curso"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CourseModal;
