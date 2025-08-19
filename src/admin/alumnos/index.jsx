import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UsuariosIndex() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState(null);

  const cargarUsuarios = () => {
    axios
      .get("/usuario")
      .then((respuesta) => {
        setLoading(false);
        if (respuesta.status === 200) {
          setData(respuesta.data.data);
        } else {
          console.error("Error al obtener los usuarios:", respuesta.statusText);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error al obtener los usuarios:", error);
      });
  };

  useEffect(() => {
    setLoading(true);
    cargarUsuarios();
  }, []);

  const abrirModalConfirmacion = (id) => {
    setIdAEliminar(id);
    setModalOpen(true);
  };

  const confirmarEliminacion = () => {
    if (!idAEliminar) return;
    axios
      .delete(`/usuario/${idAEliminar}`)
      .then(() => {
        setModalOpen(false);
        setIdAEliminar(null);
        cargarUsuarios();
      })
      .catch((error) => {
        console.error("Error al borrar el usuario:", error);
      });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Usuarios</h1>
      <p className="mb-4">Bienvenido a la sección de usuarios.</p>

      <div className="ml-5">
        <button
          className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700"
          onClick={() => navigate("/admin/usuario/nuevo")}
        >
          Crear Usuario
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="min-w-full border mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">DNI</th>
              <th className="p-2 border">Teléfono</th>
              <th className="p-2 border">Rol</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((usuario) => (
              <tr key={usuario.idUsuario} className="border-b">
                <td className="p-2">{usuario.nombre}</td>
                <td className="p-2">{usuario.dni}</td>
                <td className="p-2">{usuario.telefono}</td>
                <td className="p-2">
                  {usuario.rol === 2 ? "Admin" : "Alumno"}
                </td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() =>
                      navigate(`/admin/usuario/${usuario.idUsuario}`)
                    }
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => abrirModalConfirmacion(usuario.idUsuario)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                  {usuario.rol === 1 && (
                    <>
                      <button
                        onClick={() =>
                          navigate(
                            `/admin/usuario/${usuario.idUsuario}/disciplinas`
                          )
                        }
                        className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                      >
                        Asignar Disciplinas
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/admin/usuario/${usuario.idUsuario}/plan`)
                        }
                        className="bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700"
                      >
                        Asignar Plan
                      </button>
                    </>
                  )}
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

export default UsuariosIndex;
