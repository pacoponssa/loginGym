import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AlumnosAdmin() {
  const [alumnos, setAlumnos] = useState([]);
  const navigate = useNavigate();

  const cargarAlumnos = async () => {
    try {
      const res = await axios.get("/usuario");
      setAlumnos(res.data.data);
    } catch (error) {
      console.error("Error al cargar alumnos:", error);
    }
  };

  useEffect(() => {
    cargarAlumnos();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Alumnos</h2>
      <button
        onClick={() => navigate("/admin/usuario")}
        className="inline-block mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Crear nuevo alumno
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map((alumno) => (
              <tr key={alumno.idUsuario}>
                <td className="px-4 py-2 border">
                  {alumno.nombre} {alumno.apellido}
                </td>
                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() => navigate(`/admin/usuario/${alumno.idUsuario}`)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => navigate(`/admin/usuario/${alumno.idUsuario}/disciplinas`)}
                    className="bg-purple-500 text-white px-3 py-1 rounded"
                  >
                    Disciplinas
                  </button>
                  <button
                    onClick={() => navigate(`/admin/usuario/${alumno.idUsuario}/plan`)}
                    className="bg-indigo-500 text-white px-3 py-1 rounded"
                  >
                    Plan
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
