import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function InicioAlumno() {
  const [clases, setClases] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const cargarClases = async () => {
    try {
      if (!user?.idUsuario) return;
      const res = await axios.get(`/reserva/usuario/${user.idUsuario}`);
      const ordenadas = res.data.data.sort(
        (a, b) =>
          new Date(`${a.fecha}T${a.horaInicio}`) -
          new Date(`${b.fecha}T${b.horaInicio}`)
      );
      setClases(ordenadas);
    } catch (err) {
      console.error("Error al cargar clases:", err);
      setError("No se pudieron cargar las clases.");
    }
  };

  const cancelarClase = async (idReserva) => {
    if (!window.confirm("¿Estás seguro de cancelar esta clase?")) return;
    try {
      await axios.post(`/cancelacion/${idReserva}`);
      cargarClases();
    } catch (err) {
      console.error("Error al cancelar:", err);
      alert("Error al cancelar la clase.");
    }
  };

  useEffect(() => {
    if (user?.id) cargarClases();
  }, [user]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Próximas Clases</h2>

      {error && <p className="text-red-500">{error}</p>}

      {clases.length === 0 ? (
        <p className="text-gray-600">No tenés clases próximas.</p>
      ) : (
        <div className="grid gap-4">
          {clases.map((clase) => (
            <div key={clase.idReserva} className="border rounded p-4 shadow-md">
              <p className="font-semibold">
                {clase.horario?.Disciplina?.nombre || "Disciplina"}
              </p>
              <p>
                <strong>Fecha:</strong> {clase.fecha}
              </p>
              <p>
                <strong>Hora:</strong> {clase.horaInicio} a {clase.horaFin}
              </p>
              {!clase.cancelada ? (
                <button
                  className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => cancelarClase(clase.idReserva)}
                >
                  Cancelar Clase
                </button>
              ) : (
                <p className="text-red-600 mt-2">Cancelada</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
