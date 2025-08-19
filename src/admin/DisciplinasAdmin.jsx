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

  const eliminarDisciplina = async (idDisciplina) => {
    const confirmar = confirm("¿Estás seguro de eliminar esta disciplina?");
    if (!confirmar) return;

    try {
      await axios.delete(`/disciplina/${idDisciplina}`);
      await cargarDisciplinas(); // Actualiza la lista
    } catch (error) {
      console.error("Error al eliminar disciplina:", error);
      alert("No se pudo eliminar la disciplina.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Gestión de Disciplinas</h2>

      <button
        onClick={() => navigate("/admin/disciplinas/nueva")}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Crear nueva disciplina
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Descripción</th>
              <th className="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {disciplinas.map((disc) => (
              <tr key={disc.idDisciplina}>
                <td className="px-4 py-2 border">{disc.nombre}</td>
                <td className="px-4 py-2 border">{disc.descripcion}</td>
                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() =>
                      navigate(`/admin/disciplinas/${disc.idDisciplina}`)
                    }
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarDisciplina(disc.idDisciplina)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
