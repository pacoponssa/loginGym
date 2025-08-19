import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function MisClases() {
  const { user } = useContext(AuthContext);
  const [clases, setClases] = useState([]);

  const cargarClases = async () => {
    try {
      const res = await axios.get(`/reserva/usuario/${user.idUsuario}`);
      setClases(res.data.data);
    } catch (error) {
      console.error("Error al cargar clases:", error);
    }
  };

  const cancelar = async (idReserva) => {
    if (!window.confirm("¿Seguro que deseas cancelar esta clase?")) return;
    try {
      await axios.post(`/cancelacion/${idReserva}`);
      cargarClases();
    } catch (error) {
      console.error("Error al cancelar clase:", error);
    }
  };

  useEffect(() => {
    if (user?.id) cargarClases();
  }, [user]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Mis clases reservadas</h2>
      {clases.length === 0 ? (
        <p className="text-gray-500">No tenés clases reservadas.</p>
      ) : (
        <div className="grid gap-4">
          {clases
            .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
            .map((clase) => (
              <div key={clase.idReserva} className="p-4 border rounded shadow">
                <p><strong>Disciplina:</strong> {clase.horario?.Disciplina?.nombre}</p>
                <p><strong>Fecha:</strong> {clase.fecha}</p>
                <p><strong>Hora:</strong> {clase.horaInicio}</p>
                {!clase.cancelada ? (
                  <button
                    onClick={() => cancelar(clase.idReserva)}
                    className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Cancelar
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
