import { useEffect, useState } from "react";
import axios from "axios";

function CancelacionesIndex() {
  const [cancelaciones, setCancelaciones] = useState([]);

  useEffect(() => {
    axios
      .get("/cancelacion")
      .then((res) => setCancelaciones(res.data.data))
      .catch((err) => console.error("Error al cargar cancelaciones:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cancelaciones de Clases</h1>
      <table className="min-w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Alumno</th>
            <th className="p-2 border">DNI</th>
            <th className="p-2 border">Disciplina</th>
            <th className="p-2 border">Fecha</th>
            <th className="p-2 border">Horario</th>
            <th className="p-2 border">Motivo</th>
          </tr>
        </thead>
        <tbody>
          {cancelaciones.map((c) => (
            <tr key={c.idCancelacion} className="border-b">
              <td className="p-2">{c.Reserva?.Usuario?.nombre}</td>
              <td className="p-2">{c.Reserva?.Usuario?.dni}</td>
              <td className="p-2">
                {c.Reserva?.Horario?.Disciplina?.nombre || "—"}
              </td>
              <td className="p-2">{c.Reserva?.Horario?.fecha}</td>
              <td className="p-2">
                {c.Reserva?.Horario?.horaInicio?.slice(0, 5)} -{" "}
                {c.Reserva?.Horario?.horaFin?.slice(0, 5)}
              </td>
              <td className="p-2">{c.motivo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CancelacionesIndex;
