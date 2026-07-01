import React from "react";
import { Trash2, Edit3, PlusCircle } from "lucide-react";

function CursosSection({
  cursos,
  onEditCourse,
  onDeleteCourse,
  onAddContent
}) {
  return (
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
                    curso.estado
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}>
                    {curso.estado ? "Activo" : "Inactivo"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditCourse(curso)}
                    className="p-2 bg-surf-low hover:bg-accent-blue/10 border border-surf-high hover:border-accent-blue/20 text-brand-muted hover:text-accent-blue rounded-lg transition-colors duration-200"
                    title="Editar curso y contenidos"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteCourse(curso.id)}
                    className="p-2 bg-surf-low hover:bg-red-500/10 border border-surf-high hover:border-red-500/20 text-brand-muted hover:text-red-400 rounded-lg transition-colors duration-200"
                    title="Desactivar curso"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onAddContent(curso, "modulo")}
                  className="flex-1 py-2 bg-surf-low hover:bg-surf-high border border-surf-high text-brand-light text-xs font-semibold rounded-lg transition-colors duration-150 flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-accent-blue" />
                  <span>Agregar Módulo</span>
                </button>
                <button
                  onClick={() => onAddContent(curso, "examen")}
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
  );
}

export default CursosSection;
