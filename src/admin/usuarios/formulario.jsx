import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function FormularioUsuarios() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usuario, setUsuario] = useState({
    nombre: "",
    dni: "",
    password: "",
    telefono: "",
    rol: "alumno", // por defecto
  });

  const [todasDisciplinas, setTodasDisciplinas] = useState([]);
  const [disciplinasAsignadas, setDisciplinasAsignadas] = useState([]);

  useEffect(() => {
    const fetchDisciplinas = async () => {
      const res = await axios.get("/disciplina");
      setTodasDisciplinas(res.data.data);
    };

    const fetchUsuario = async () => {
      if (id !== "nuevo") {
        setLoading(true);
        const res = await axios.get(`/usuarios/${id}`);
        const user = res.data.data;
        setUsuario({
          nombre: user.nombre,
          dni: user.dni,
          telefono: user.telefono,
          password: "",
          rol: user.rol === 2 ? "admin" : "alumno",
        });

        // si es alumno, obtener sus disciplinas
        if (user.rol === 1) {
          const r = await axios.get(`/inscripciones/${id}/disciplinas`);
          const ids = r.data.data.map((d) => d.idDisciplina);
          setDisciplinasAsignadas(ids);
        }

        setLoading(false);
      }
    };

    fetchDisciplinas();
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
    if (id === "nuevo") {
      const respuestaUsuario = await axios.post("/usuarios", dataParaEnviar);
      const nuevoId = respuestaUsuario.data.data.idUsuario;
      if (dataParaEnviar.rol === 1) {
        await axios.post(`/inscripcion/${nuevoId}/disciplinas`, {
          idsDisciplinas: disciplinasAsignadas,
        });
      }
    } else {
      await axios.put(`/usuarios/${id}`, dataParaEnviar);
      if (dataParaEnviar.rol === 1) {
        await axios.post(`/inscripcion/${id}/disciplinas`, {
          idsDisciplinas: disciplinasAsignadas,
        });
      }
    }
    navigate("/admin/usuarios");
    alert("Usuario guardado correctamente.");
  } catch (error) {
    setError(error.message);
  }
};


  return (
    <div>
      <div className="p-6 text-2xl font-bold text-center text-white bg-blue-600">
        {id !== "nuevo" ? "Editar Usuario" : "Crear Nuevo Usuario"}
      </div>
      {loading ? (
        <p className="text-center mt-6">Cargando...</p>
      ) : (
        <div className="max-w-md p-5 mx-auto mt-10 bg-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-bold text-gray-700">
                Nombre:
              </label>
              <input
                type="text"
                name="nombre"
                value={usuario.nombre}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-bold text-gray-700">
                DNI:
              </label>
              <input
                type="text"
                name="dni"
                value={usuario.dni}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-bold text-gray-700">
                Teléfono:
              </label>
              <input
                type="text"
                name="telefono"
                value={usuario.telefono}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

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
                required={id === "nuevo"}
                disabled={id !== "nuevo"}
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

            {usuario.rol === "alumno" && (
              <div className="mb-4">
                <label className="block mb-1 text-sm font-bold text-gray-700">
                  Disciplinas asignadas:
                </label>
                {todasDisciplinas.map((disc) => (
                  <div
                    key={disc.idDisciplina}
                    className="flex items-center gap-2 mb-1"
                  >
                    <input
                      type="checkbox"
                      checked={disciplinasAsignadas.includes(disc.idDisciplina)}
                      onChange={() => {
                        setDisciplinasAsignadas((prev) =>
                          prev.includes(disc.idDisciplina)
                            ? prev.filter((id) => id !== disc.idDisciplina)
                            : [...prev, disc.idDisciplina]
                        );
                      }}
                    />
                    <span>{disc.nombre}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="px-4 py-2 mx-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/usuarios")}
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

export default FormularioUsuarios;
