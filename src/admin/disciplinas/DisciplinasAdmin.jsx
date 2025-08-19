import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function DisciplinasAdmin() {
  const [disciplinas, setDisciplinas] = useState([]);
  const navigate = useNavigate();

  const cargarDisciplinas = async () => {
    try {
      const res = await axios.get("/disciplina");
      setDisciplinas(res.data.data);
    } catch (error) {
      console.error("Error al cargar disciplinas:", error);
    }
  };

  useEffect(() => {
    cargarDisciplinas();
  }, []);

  const eliminarDisciplina = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta disciplina?")) return;
    try {
      await axios.delete(`/disciplina/${id}`);
      cargarDisciplinas();
    } catch (error) {
      console.error("Error al eliminar la disciplina:", error);
      alert("No se pudo eliminar la disciplina.");
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Disciplinas</h2>
        <button
          onClick={() => navigate("/admin/disciplinas/nueva")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Nueva disciplina
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Cupo por turno</th>
              <th className="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {disciplinas.map((disciplina) => (
              <tr key={disciplina.idDisciplina}>
                <td className="px-4 py-2 border">{disciplina.nombre}</td>
                <td className="px-4 py-2 border">{disciplina.cupoPorTurno}</td>
                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() =>
                      navigate(`/admin/disciplinas/${disciplina.idDisciplina}`)
                    }
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarDisciplina(disciplina.idDisciplina)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {disciplinas.length === 0 && (
              <tr>
                <td colSpan="3" className="px-4 py-6 text-center text-gray-500">
                  No hay disciplinas cargadas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
