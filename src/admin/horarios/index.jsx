import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function HorariosIndex() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState(null);

  const cargarHorarios = () => {
    axios
      .get("/horario")
      .then((respuesta) => {
        setLoading(false);
        if (respuesta.status === 200) {
          setData(respuesta.data.data);
        } else {
          console.error("Error al obtener los horarios:", respuesta.statusText);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error al obtener los horarios:", error);
      });
  };

  useEffect(() => {
    setLoading(true);
    cargarHorarios();
  }, []);

  const abrirModalConfirmacion = (id) => {
    setIdAEliminar(id);
    setModalOpen(true);
  };

  const confirmarEliminacion = () => {
    if (!idAEliminar) return;
    axios
      .delete(`/horario/${idAEliminar}`)
      .then(() => {
        setModalOpen(false);
        setIdAEliminar(null);
        cargarHorarios();
      })
      .catch((error) => {
        const mensaje =
          error.response?.data?.msg ||
          "No se puede eliminar este horario porque tiene registros relacionados.";
        alert(mensaje);
        console.error("Error al borrar el horario:", error);
      });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Horarios</h1>
      <p className="mb-4">Bienvenido a la sección de horarios.</p>

      <div className="ml-5">
        <button
          className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700"
          onClick={() => navigate("/admin/horarios/nuevo")}
        >
          Crear Horario
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Disciplina</th>
              <th className="p-2 border">Fecha</th>
              <th className="p-2 border">Hora Inicio</th>
              <th className="p-2 border">Hora Fin</th>
              <th className="p-2 border">Cupo Máximo</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((horario) => (
              <tr key={horario.idHorario} className="text-center border-b">
                <td className="p-2 border">
                  {horario.Disciplina?.nombre || horario.idDisciplina}
                </td>
                <td className="p-2 border">{horario.fecha}</td>
                <td className="p-2 border">{horario.horaInicio}</td>
                <td className="p-2 border">{horario.horaFin}</td>
                <td className="p-2 border">{horario.cupoMaximo}</td>
                <td className="p-2 border">
                  <div className="flex justify-center gap-2">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded">
                      Editar
                    </button>
                    <button
                      onClick={() => abrirModalConfirmacion(horario.idHorario)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Borrar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-md text-center w-80">
            <h2 className="text-lg font-semibold mb-4">
              ¿Confirmar eliminación?
            </h2>
            <p className="mb-4 text-sm">Esta acción no se puede deshacer.</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                onClick={() => setModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                onClick={confirmarEliminacion}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HorariosIndex;
