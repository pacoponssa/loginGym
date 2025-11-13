import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfesoresAdmin = () => {
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerProfesores = async () => {
      try {
        const res = await axios.get("/profesores");
        setProfesores(res.data);
      } catch (error) {
        console.error("Error al obtener profesores:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerProfesores();
  }, []);

  if (loading) return <p>Cargando profesores...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Listado de Profesores</h2>

      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">DNI</th>
            <th className="border p-2">Teléfono</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {profesores.map((prof) => (
            <tr key={prof.idUsuario}>
              <td className="border p-2">{prof.nombre}</td>
              <td className="border p-2">{prof.dni}</td>
              <td className="border p-2">{prof.telefono}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() =>
                    alert(`Ver turnos del profesor ID: ${prof.idUsuario}`)
                  }
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Turnos
                </button>
                <button
                  onClick={() =>
                    alert(`Ver sueldo del profesor ID: ${prof.idUsuario}`)
                  }
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Sueldo
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProfesoresAdmin;
