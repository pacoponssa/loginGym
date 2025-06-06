import React, { useEffect, useState } from "react";
import axios from "axios";

function ReservaAlumno() {
  const [horarios, setHorarios] = useState([]);
  const [idHorario, setIdHorario] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const idUsuario = usuario?.idUsuario;

  useEffect(() => {
    axios
      .get("/horario")
      .then((res) => setHorarios(res.data.data))
      .catch((err) => setError("Error al cargar horarios"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (!idUsuario || !idHorario) {
      setError("Seleccione un horario válido");
      return;
    }

    try {
      await axios.post("/reserva", { idUsuario, idHorario });
      setMensaje("Reserva creada correctamente");
      setIdHorario("");
    } catch (err) {
      setError("No se pudo realizar la reserva. Verifique disponibilidad o si ya tiene una existente.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Reservar horario</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Horario disponible:</label>
          <select
            className="w-full p-2 border rounded"
            value={idHorario}
            onChange={(e) => setIdHorario(Number(e.target.value))}
            required
          >
            <option value="">Seleccione un horario</option>
            {horarios.map((h) => (
              <option key={h.idHorario} value={h.idHorario}>
                {`${h.Disciplina?.nombre || "Disciplina"} - ${h.fecha} - ${h.horaInicio}`}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700"
          >
            Confirmar Reserva
          </button>
        </div>
      </form>
      {mensaje && <p className="mt-4 text-green-600 text-center">{mensaje}</p>}
      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
    </div>
  );
}

export default ReservaAlumno;
