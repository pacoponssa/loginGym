import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DisciplinasIndex() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState(null);

  const cargarDisciplinas = () => {
    axios
      .get("/disciplina")
      .then((respuesta) => {
        setLoading(false);
        if (respuesta.status === 200) {
          setData(respuesta.data.data);
        } else {
          console.error(
            "Error al obtener las disciplinas:",
            respuesta.statusText
          );
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error al obtener las disciplinas:", error);
      });
  };

  useEffect(() => {
    setLoading(true);
    cargarDisciplinas();
  }, []);

  const abrirModalConfirmacion = (id) => {
    setIdAEliminar(id);
    setModalOpen(true);
  };

  const confirmarEliminacion = () => {
    if (!idAEliminar) return;
    axios
      .delete(`/disciplina/${idAEliminar}`)
      .then(() => {
        setModalOpen(false);
        setIdAEliminar(null);
        cargarDisciplinas();
      })
      .catch((error) => {
        console.error("Error al borrar la disciplina:", error);
      });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Disciplinas</h1>
      <p className="mb-4">Bienvenido a la sección de disciplinas.</p>

      <div className="ml-5">
        <button
          className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700"
          onClick={() => navigate("/admin/disciplinas/nueva")}
        >
          Crear Diciplina
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Descripción</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.idDisciplina} className="text-center border-b">
                <td className="p-2 border">{item.nombre}</td>
                <td className="p-2 border">{item.descripcion}</td>
                <td className="p-2 border">
                  <div className="flex justify-center gap-2">
                    <button  onClick={() => navigate(`/admin/disciplinas/${item.idDisciplina}`)}
                    className="bg-blue-500 text-white px-2 py-1 rounded">
                      EDITAR
                    </button>
                    <button
                      onClick={() => abrirModalConfirmacion(item.idDisciplina)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      BORRAR
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* MODAL DE CONFIRMACIÓN */}
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

export default DisciplinasIndex;
