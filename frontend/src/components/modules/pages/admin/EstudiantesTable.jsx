import React from "react";
import { UserCog, BookOpen } from "lucide-react";

function EstudiantesTable({ estudiantes, onEditUser, onManageCourses }) {
  return (
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
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surf-high text-sm text-brand-light">
              {estudiantes.map((estudiante) => (
                <tr 
                  key={estudiante.id} 
                  className={`hover:bg-surf-low/20 transition-colors duration-150 ${
                    estudiante.estado === false ? "opacity-60" : ""
                  }`}
                >
                  <td className="py-4 px-6 font-bold">
                    <div className="flex items-center gap-2">
                      <span>{estudiante.nombre} {estudiante.apellido}</span>
                      {estudiante.estado === false && (
                        <span className="py-0.5 px-1.5 bg-brand-muted/10 border border-brand-muted/20 text-brand-muted text-[10px] font-semibold rounded">
                          Inactivo
                        </span>
                      )}
                    </div>
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
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => onEditUser(estudiante)}
                        title="Editar Usuario"
                        className="p-2 text-brand-muted hover:text-accent-blue hover:bg-accent-blue/10 rounded-lg transition-all duration-200"
                      >
                        <UserCog className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onManageCourses(estudiante)}
                        title="Gestionar Cursos"
                        className="p-2 text-brand-muted hover:text-accent-blue hover:bg-accent-blue/10 rounded-lg transition-all duration-200"
                      >
                        <BookOpen className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EstudiantesTable;
