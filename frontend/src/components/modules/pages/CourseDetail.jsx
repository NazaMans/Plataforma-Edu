import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../../../services/api.js";
import { ArrowLeft, Menu, ChevronLeft, BookOpen, FileText, Download, CheckSquare, Loader2 } from "lucide-react";

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [modulos, setModulos] = useState([]);
  const [examenes, setExamenes] = useState([]);
  const [cursoNombre, setCursoNombre] = useState("Curso");
  const [activeItem, setActiveItem] = useState({ type: "modulo", id: null }); // type: 'modulo' | 'examen'
  const [activeTab, setActiveTab] = useState("teoria"); // 'teoria' | 'practica'
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        // En base a la estructura del backend, obtenemos los módulos y exámenes del curso
        const [modulosRes, examenesRes] = await Promise.all([
          apiFetch(`/api/modulos/curso/${id}`).catch(() => ({ data: [] })),
          apiFetch(`/api/examenes/curso/${id}`).catch(() => ({ data: [] }))
        ]);

        const modulosList = modulosRes.data || [];
        const examenesList = examenesRes.data || examenesRes || []; // Dependiendo del formato de respuesta del controller

        setModulos(modulosList);
        setExamenes(examenesList);

        // Intentar obtener el nombre del curso del primer módulo o cargar por defecto
        if (modulosList.length > 0 && modulosList[0].id_curso) {
          // Buscamos si podemos deducir el nombre o llamamos a un endpoint.
          // Por simplicidad, seteamos un placeholder o deducimos
          setCursoNombre(modulosList[0].nombre_curso || "Contenido del Curso");
        } else {
          setCursoNombre("Contenido del Curso");
        }

        // Seleccionar el primer módulo por defecto
        if (modulosList.length > 0) {
          setActiveItem({ type: "modulo", id: modulosList[0].id });
        } else if (examenesList.length > 0) {
          setActiveItem({ type: "examen", id: examenesList[0].id });
        }
      } catch (err) {
        console.error("Error al cargar datos del curso:", err);
        setError("Error al cargar el contenido del curso.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center text-white gap-3">
        <Loader2 className="w-10 h-10 text-accent-blue animate-spin" />
        <p className="text-brand-muted text-sm">Cargando material del curso...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center text-white p-6">
        <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-sm p-6 rounded-lg text-center max-w-md">
          <p className="font-bold mb-4">Ocurrió un error</p>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-accent-darkblue hover:bg-accent-blue rounded-lg text-sm font-semibold transition-all duration-200"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const selectedItemData =
    activeItem.type === "modulo"
      ? modulos.find((m) => m.id === activeItem.id)
      : examenes.find((e) => e.id === activeItem.id);

  return (
    <div className="min-h-screen bg-brand-dark text-white font-sans flex flex-col">
      {/* Top Header */}
      <header className="w-full bg-surf-lowest border-b border-surf-high px-6 py-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-brand-muted hover:text-brand-light text-sm font-semibold transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a cursos</span>
          </button>
          <span className="text-surf-high">|</span>
          <h2 className="text-lg font-bold text-brand-light">{cursoNombre}</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 bg-surf-low hover:bg-surf-high border border-surf-high text-brand-light rounded-lg transition-colors duration-200"
            title="Alternar barra lateral"
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Collapsible Left Sidebar */}
        <aside
          className={`bg-surf-lowest border-r border-surf-high flex flex-col justify-between transition-all duration-300 z-10 select-none ${
            sidebarOpen ? "w-80" : "w-0 overflow-hidden border-r-0"
          }`}
        >
          <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-8">
            {/* Modules List */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider px-2">
                Módulos
              </h3>
              <div className="flex flex-col gap-1">
                {modulos.length === 0 ? (
                  <p className="text-brand-muted text-xs px-2 italic">No hay módulos cargados.</p>
                ) : (
                  modulos.map((modulo) => (
                    <button
                      key={modulo.id}
                      onClick={() => setActiveItem({ type: "modulo", id: modulo.id })}
                      className={`w-full text-left px-3 py-3 rounded-lg text-sm font-medium flex items-start gap-3 transition-all duration-200 ${
                        activeItem.type === "modulo" && activeItem.id === modulo.id
                          ? "bg-accent-darkblue text-white"
                          : "hover:bg-surf-low text-brand-muted hover:text-brand-light"
                      }`}
                    >
                      <BookOpen className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="truncate">
                        Módulo {modulo.numero || 1}: {modulo.nombre}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Exams List */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider px-2">
                Exámenes
              </h3>
              <div className="flex flex-col gap-1">
                {examenes.length === 0 ? (
                  <p className="text-brand-muted text-xs px-2 italic">No hay exámenes cargados.</p>
                ) : (
                  examenes.map((examen) => (
                    <button
                      key={examen.id}
                      onClick={() => setActiveItem({ type: "examen", id: examen.id })}
                      className={`w-full text-left px-3 py-3 rounded-lg text-sm font-medium flex items-start gap-3 transition-all duration-200 ${
                        activeItem.type === "examen" && activeItem.id === examen.id
                          ? "bg-accent-darkblue text-white"
                          : "hover:bg-surf-low text-brand-muted hover:text-brand-light"
                      }`}
                    >
                      <FileText className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="truncate">{examen.nombre}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-surf-high bg-surf-lowest text-center">
            <span className="text-xs text-brand-muted font-bold tracking-widest uppercase">
              Mansillas Edu
            </span>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-brand-dark overflow-y-auto p-8 flex flex-col">
          {selectedItemData ? (
            <div className="max-w-4xl w-full mx-auto bg-surf-lowest border border-surf-high rounded-xl p-8 shadow-md">
              {activeItem.type === "modulo" ? (
                // MODULE VIEW
                <div className="flex flex-col gap-6">
                  <div>
                    <span className="text-xs text-accent-blue font-bold uppercase tracking-wider">
                      Módulo {selectedItemData.numero}
                    </span>
                    <h3 className="text-2xl font-bold text-brand-light mt-1">
                      {selectedItemData.nombre}
                    </h3>
                  </div>

                  {/* Teoría / Práctica tabs selector */}
                  <div className="flex border-b border-surf-high">
                    <button
                      onClick={() => setActiveTab("teoria")}
                      className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all duration-200 ${
                        activeTab === "teoria"
                          ? "border-accent-blue text-brand-light"
                          : "border-transparent text-brand-muted hover:text-brand-light"
                      }`}
                    >
                      Teoría
                    </button>
                    <button
                      onClick={() => setActiveTab("practica")}
                      className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all duration-200 ${
                        activeTab === "practica"
                          ? "border-accent-blue text-brand-light"
                          : "border-transparent text-brand-muted hover:text-brand-light"
                      }`}
                    >
                      Práctica
                    </button>
                  </div>

                  {/* Active content rendering */}
                  <div className="py-4">
                    {activeTab === "teoria" ? (
                      <div className="prose prose-invert max-w-none text-brand-light space-y-4">
                        {selectedItemData.teoria ? (
                          selectedItemData.teoria.startsWith("http") ? (
                            <div className="flex flex-col gap-4 items-start p-6 bg-surf-low rounded-lg border border-surf-high">
                              <p className="text-sm">El material teórico de este módulo se encuentra en un archivo externo.</p>
                              <a
                                href={selectedItemData.teoria}
                                target="_blank"
                                rel="noreferrer"
                                className="px-4 py-2.5 bg-accent-darkblue hover:bg-accent-blue text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all duration-200 shadow-md"
                              >
                                <Download className="w-4 h-4" />
                                <span>Descargar material (PDF/Enlace)</span>
                              </a>
                            </div>
                          ) : (
                            <div className="whitespace-pre-wrap leading-relaxed text-sm bg-surf-low/30 p-6 rounded-lg border border-surf-high/60">
                              {selectedItemData.teoria}
                            </div>
                          )
                        ) : (
                          <p className="text-brand-muted text-sm italic">No hay contenido teórico registrado para este módulo.</p>
                        )}
                      </div>
                    ) : (
                      <div className="prose prose-invert max-w-none text-brand-light space-y-4">
                        {selectedItemData.practica ? (
                          selectedItemData.practica.startsWith("http") ? (
                            <div className="flex flex-col gap-4 items-start p-6 bg-surf-low rounded-lg border border-surf-high">
                              <p className="text-sm">La consigna de ejercicios prácticos está disponible para su descarga.</p>
                              <a
                                href={selectedItemData.practica}
                                target="_blank"
                                rel="noreferrer"
                                className="px-4 py-2.5 bg-accent-darkblue hover:bg-accent-blue text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all duration-200 shadow-md"
                              >
                                <CheckSquare className="w-4 h-4" />
                                <span>Descargar enunciado práctico</span>
                              </a>
                            </div>
                          ) : (
                            <div className="whitespace-pre-wrap leading-relaxed text-sm bg-surf-low/30 p-6 rounded-lg border border-surf-high/60">
                              {selectedItemData.practica}
                            </div>
                          )
                        ) : (
                          <p className="text-brand-muted text-sm italic">No hay ejercicios prácticos asignados para este módulo.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // EXAM VIEW
                <div className="flex flex-col gap-6">
                  <div>
                    <span className="text-xs text-red-400 font-bold uppercase tracking-wider">
                      Evaluación / Examen
                    </span>
                    <h3 className="text-2xl font-bold text-brand-light mt-1">
                      {selectedItemData.nombre}
                    </h3>
                  </div>

                  <div className="p-6 bg-surf-low rounded-lg border border-surf-high space-y-4">
                    <h4 className="text-sm font-bold text-brand-light">Consigna de la evaluación:</h4>
                    {selectedItemData.actividad ? (
                      selectedItemData.actividad.startsWith("http") ? (
                        <a
                          href={selectedItemData.actividad}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent-darkblue hover:bg-accent-blue text-white text-xs font-semibold rounded-lg transition-colors duration-200"
                        >
                          <Download className="w-4 h-4" />
                          <span>Descargar Consigna de Examen (PDF/Enlace)</span>
                        </a>
                      ) : (
                        <p className="text-sm text-brand-muted whitespace-pre-wrap leading-relaxed">
                          {selectedItemData.actividad}
                        </p>
                      )
                    ) : (
                      <p className="text-xs text-brand-muted italic">La consigna del examen no ha sido redactada aún.</p>
                    )}
                  </div>

                  {selectedItemData.resolucion && (
                    <div className="p-6 bg-surf-low/30 rounded-lg border border-surf-high/50 space-y-3">
                      <h4 className="text-sm font-bold text-brand-light">Material de resolución o respuestas:</h4>
                      {selectedItemData.resolucion.startsWith("http") ? (
                        <a
                          href={selectedItemData.resolucion}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-xs text-accent-blue hover:text-white font-semibold transition-colors duration-200"
                        >
                          <span>Ver resolución en enlace externo</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <p className="text-xs text-brand-muted whitespace-pre-wrap">
                          {selectedItemData.resolucion}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-brand-muted italic">
              No hay material disponible para este curso.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default CourseDetail;
