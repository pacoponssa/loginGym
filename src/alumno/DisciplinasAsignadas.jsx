import React, { useEffect, useState } from "react";
import axios from "axios";

function DisciplinasAsignadas() {
  const [inscripciones, setInscripciones] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const idUsuario = usuario?.idUsuario || usuario?.id; // Revisar ***

  const cargarInscripciones = async () => {
    try {
      const res = await axios.get(`/inscripcion-usuario/usuario/${idUsuario}`);
      setInscripciones(res.data.data || []);
    } catch (err) {
      setError("No se pudieron cargar las inscripciones");
    }
  };

  useEffect(() => {
    cargarInscripciones();
  }, []);

  const cancelarInscripcion = async (idInscripcion) => {
    try {
      await axios.delete(`/inscripcion/${idInscripcion}`);
      setMensaje("Inscripción cancelada correctamente");
      cargarInscripciones();
    } catch (err) {
      setError("No se pudo cancelar la inscripción");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
        Mis Disciplinas
      </h2>

      {mensaje && <p className="text-green-600 text-center">{mensaje}</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {inscripciones.length === 0 ? (
        <p className="text-center">No estás inscripto a ninguna disciplina.</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-indigo-100 text-gray-700">
              <th className="p-2 border">Disciplina</th>
              <th className="p-2 border">Fecha de inscripción</th>
            </tr>
          </thead>
          <tbody>
            {inscripciones.map((i) => (
              <tr key={i.idInscripcion} className="text-center">
                <td className="p-2 border">{i.Disciplina?.nombre || "Disciplina"}</td>
                <td className="p-2 border">
                  {new Date(i.fechaInscripcion).toLocaleDateString("es-AR")}
                </td>              
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DisciplinasAsignadas;
