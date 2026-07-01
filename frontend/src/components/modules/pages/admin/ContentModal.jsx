import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { modulosService } from "../../../../services/modulos/modulos.service.js";
import { examenesService } from "../../../../services/examenes/examenes.service.js";

function ContentModal({ isOpen, onClose, selectedCourse, editingContent, onSuccess, onError }) {
  const [contentForm, setContentForm] = useState({
    type: "modulo", // "modulo" | "examen"
    nombre: "",
    numero: "",
    teoria: "",
    practica: "",
    actividad: "",
    resolucion: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingContent) {
      if (editingContent.type === "modulo") {
        setContentForm({
          type: "modulo",
          nombre: editingContent.nombre || "",
          numero: editingContent.numero || "",
          teoria: editingContent.teoria || "",
          practica: editingContent.practica || "",
          actividad: "",
          resolucion: ""
        });
      } else {
        setContentForm({
          type: "examen",
          nombre: editingContent.nombre || "",
          numero: "",
          teoria: "",
          practica: "",
          actividad: editingContent.actividad || "",
          resolucion: editingContent.resolucion || ""
        });
      }
    } else {
      setContentForm({
        type: "modulo",
        nombre: "",
        numero: "",
        teoria: "",
        practica: "",
        actividad: "",
        resolucion: ""
      });
    }
  }, [editingContent, isOpen]);

  if (!isOpen || !selectedCourse) return null;

  const handleContentSubmit = async (e) => {
    e.preventDefault();
    if (!contentForm.nombre) {
      onError("El nombre es obligatorio.");
      return;
    }
    setLoading(true);
    try {
      if (editingContent) {
        if (editingContent.type === "modulo") {
          await modulosService.actualizarModulo(editingContent.id, {
            nombre: contentForm.nombre,
            numero: parseInt(contentForm.numero, 10) || 1,
            teoria: contentForm.teoria,
            practica: contentForm.practica,
            id_curso: selectedCourse.id
          });
          onSuccess("Módulo actualizado exitosamente.");
        } else {
          await examenesService.editarExamen(editingContent.id, {
            id_curso: selectedCourse.id,
            nombre: contentForm.nombre,
            actividad: contentForm.actividad,
            resolucion: contentForm.resolucion
          });
          onSuccess("Examen actualizado exitosamente.");
        }
      } else {
        if (contentForm.type === "modulo") {
          await modulosService.crearModulo({
            nombre: contentForm.nombre,
            numero: parseInt(contentForm.numero, 10) || 1,
            teoria: contentForm.teoria,
            practica: contentForm.practica,
            id_curso: selectedCourse.id
          });
          onSuccess("Módulo agregado al curso.");
        } else {
          await examenesService.crearExamen({
            curso_id: selectedCourse.id,
            nombre: contentForm.nombre,
            actividad: contentForm.actividad,
            resolucion: contentForm.resolucion
          });
          onSuccess("Examen agregado al curso.");
        }
      }
      onClose();
    } catch (err) {
      console.error(err);
      onError(err.message || "Error al guardar el contenido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-surf-lowest border border-surf-high rounded-xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-surf-high flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-brand-light">
              {editingContent ? "Editar Contenido en:" : "Agregar Contenido a:"} {selectedCourse.nombre}
            </h3>
          </div>
          <button
            onClick={onClose}
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
                disabled={!!editingContent}
                onClick={() => setContentForm(prev => ({ ...prev, type: "modulo" }))}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all disabled:opacity-50 ${
                  contentForm.type === "modulo"
                    ? "bg-accent-darkblue text-white shadow-sm"
                    : "text-brand-muted hover:text-brand-light"
                }`}
              >
                Módulo
              </button>
              <button
                type="button"
                disabled={!!editingContent}
                onClick={() => setContentForm(prev => ({ ...prev, type: "examen" }))}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all disabled:opacity-50 ${
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
              {loading ? "Guardando..." : editingContent ? "Guardar Cambios" : "Guardar Contenido"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContentModal;
