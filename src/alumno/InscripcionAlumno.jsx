import React, { useEffect, useState } from "react";
import axios from "axios";

function InscripcionAlumno() {
  const [disciplinas, setDisciplinas] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const idUsuario = usuario?.idUsuario || usuario?.id;

  useEffect(() => {
    // Carga disciplinas
    axios
      .get("/disciplina")
      .then((res) => setDisciplinas(res.data.data))
      .catch(() => setError("No se pudieron cargar las disciplinas"));
               
    // Carga inscripciones del almuno
    if (idUsuario) {
      axios
        .get(`/inscripcion/usuario/${idUsuario}`)
        .then((res) => setInscripciones(res.data.data))
        .catch(() => setError("No se pudieron cargar las inscripciones"));
    }
  }, [idUsuario]);

  const estaInscripto = (idDisciplina) =>
    inscripciones.some((i) => i.idDisciplina === idDisciplina);

  const manejarInscripcion = async (idDisciplina) => {
    try {
      setMensaje("");
      const res = await axios.post("/inscripcion", {
        idUsuario,
        idDisciplina,
        fechaInscripcion: new Date(),
      });
      setInscripciones([...inscripciones, res.data.data]);
      setMensaje("Inscripción realizada con éxito");
    } catch (err) {
      setError("Error al inscribirse: " + (err.response?.data?.msg || err.message));
    }
  };

  const manejarDesinscripcion = async (idDisciplina) => {
    const insc = inscripciones.find((i) => i.idDisciplina === idDisciplina);
    if (!insc) return;

    try {
      setMensaje("");
      await axios.delete(`/inscrpicion/${insc.idInscripcion}`);
      setInscripciones(inscripciones.filter((i) => i.idDisciplina !== idDisciplina));
      setMensaje("Desinscripción exitosa");
    } catch (err) {
      setError("Error al desinscribirse: " + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
        Inscripción a Disciplinas
      </h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {mensaje && <p className="text-green-600 text-center mb-4">{mensaje}</p>}

      <table className="min-w-full border">
        <thead>
          <tr className="bg-indigo-100 text-gray-700">
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Descripción</th>
            <th className="p-2 border">Acción</th>
          </tr>
        </thead>
        <tbody>
          {disciplinas.map((disciplina) => {
            const inscripto = estaInscripto(disciplina.idDisciplina);
            return (
              <tr key={disciplina.idDisciplina} className="text-center">
                <td className="p-2 border">{disciplina.nombre}</td>
                <td className="p-2 border">{disciplina.descripcion}</td>
                <td className="p-2 border">
                  {inscripto ? (
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => manejarDesinscripcion(disciplina.idDisciplina)}
                    >
                      Desinscribirse
                    </button>
                  ) : (
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                      onClick={() => manejarInscripcion(disciplina.idDisciplina)}
                    >
                      Inscribirse
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default InscripcionAlumno;
