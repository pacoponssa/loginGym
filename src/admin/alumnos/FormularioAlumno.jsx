import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function FormularioAlumno() {
  const { id } = useParams(); // ✅ Obtenemos el ID de la URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usuario, setUsuario] = useState({
    nombre: "",
    dni: "",
    password: "",
    telefono: "",
    rol: "alumno", // por defecto
  });

  useEffect(() => {
    const fetchUsuario = async () => {
      if (id) {
        setLoading(true);
        try {
          const res = await axios.get(`/usuario/${id}`);
          const user = res.data.data;
          setUsuario({
            nombre: user.nombre,
            dni: user.dni,
            telefono: user.telefono,
            password: "",
            rol: user.rol === 2 ? "admin" : "alumno",
          });
        } catch (err) {
          setError("Error al cargar el usuario");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUsuario();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataParaEnviar = {
      ...usuario,
      rol: usuario.rol === "admin" ? 2 : 1,
    };
    if (!dataParaEnviar.password) delete dataParaEnviar.password;

    try {
      if (!id) {
        await axios.post("/usuario", dataParaEnviar);
      } else {
        await axios.put(`/usuario/${id}`, dataParaEnviar);
      }
      alert("Usuario guardado correctamente.");
      navigate("/admin/alumnos");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <div className="p-6 text-2xl font-bold text-center text-white bg-blue-600">
        {id ? "Editar Usuario" : "Crear Nuevo Usuario"}
      </div>
      {loading ? (
        <p className="text-center mt-6">Cargando...</p>
      ) : (
        <div className="max-w-md p-5 mx-auto mt-10 bg-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            {["nombre", "dni", "telefono"].map((field) => (
              <div className="mb-4" key={field}>
                <label className="block mb-1 text-sm font-bold text-gray-700">
                  {field.charAt(0).toUpperCase() + field.slice(1)}:
                </label>
                <input
                  type="text"
                  name={field}
                  value={usuario[field]}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required={field !== "telefono"}
                />
              </div>
            ))}

            <div className="mb-4">
              <label className="block mb-1 text-sm font-bold text-gray-700">
                Contraseña:
              </label>
              <input
                type="password"
                name="password"
                value={usuario.password}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required={!id}
                disabled={!!id}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-bold text-gray-700">
                Rol:
              </label>
              <select
                name="rol"
                value={usuario.rol}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="alumno">Alumno</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="px-4 py-2 mx-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/alumnos")}
                className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
}

export default FormularioAlumno;
