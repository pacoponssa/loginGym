import React, { useEffect, useState } from "react";
import axios from "axios";

const MisClases = () => {
  const [reservas, setReservas] = useState([]);
  const [filtradas, setFiltradas] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [disciplinaSeleccionada, setDisciplinaSeleccionada] = useState("todas");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [usuario, setUsuario] = useState(null);

  // const usuario = JSON.parse(localStorage.getItem("usuario"));

  // Obtener el usuario una vez
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("usuario"));
    setUsuario(storedUser);
  }, []);

  useEffect(() => {
    const cargarReservas = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/reserva/usuario/${usuario.idUsuario}`);
        const reservasObtenidas = res.data.data;

        setReservas(reservasObtenidas);
        setFiltradas(reservasObtenidas);

        // Extraer disciplinas únicas
        const disciplinasUnicas = [
          ...new Set(
            reservasObtenidas.map((r) => r.Horario?.Disciplina?.nombre).filter(Boolean)
          ),
        ];
        setDisciplinas(disciplinasUnicas);

        setLoading(false);
      } catch (err) {
        setError("Error al cargar las reservas");
        setLoading(false);
      }
    };

    if (usuario?.idUsuario) {
      cargarReservas();
    }
  }, [usuario]);

  const handleFiltrar = (nombreDisciplina) => {
    setDisciplinaSeleccionada(nombreDisciplina);
    if (nombreDisciplina === "todas") {
      setFiltradas(reservas);
    } else {
      setFiltradas(
        reservas.filter((r) => r.Horario?.Disciplina?.nombre === nombreDisciplina)
      );
    }
  };

  const cancelarReserva = async (idReserva) => {
    try {
      await axios.post(`/cancelacion/${idReserva}`, {
        motivo: "Cancelación voluntaria",
      });
      setMensaje("Reserva cancelada exitosamente.");
      const nuevasReservas = reservas.filter((r) => r.idReserva !== idReserva);
      setReservas(nuevasReservas);
      handleFiltrar(disciplinaSeleccionada); // Refrescar con filtro activo
    } catch (err) {
      setError("No se pudo cancelar la reserva.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-center">Mis Clases</h2>

      {mensaje && <p className="text-green-600 mb-2 text-center">{mensaje}</p>}
      {error && <p className="text-red-600 mb-2 text-center">{error}</p>}

      <div className="flex flex-wrap justify-center gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded text-white ${
            disciplinaSeleccionada === "todas" ? "bg-blue-600" : "bg-gray-500"
          }`}
          onClick={() => handleFiltrar("todas")}
        >
          Todas
        </button>
        {disciplinas.map((d) => (
          <button
            key={d}
            className={`px-3 py-1 rounded text-white ${
              disciplinaSeleccionada === d ? "bg-blue-600" : "bg-gray-500"
            }`}
            onClick={() => handleFiltrar(d)}
          >
            {d}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center">Cargando clases...</p>
      ) : filtradas.length === 0 ? (
        <p className="text-center text-gray-600">
          No tenés clases asignadas por el momento.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtradas.map((r) => (
            <div
              key={r.idReserva}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
            >
              <h3 className="font-bold text-lg mb-2">
                {r.Horario?.Disciplina?.nombre || "Sin nombre"}
              </h3>
              <p className="text-sm mb-1">📅 Fecha: {r.Horario?.fecha}</p>
              <p className="text-sm mb-3">
                🕒 {r.Horario?.horaInicio?.slice(0, 5)} -{" "}
                {r.Horario?.horaFin?.slice(0, 5)}
              </p>
              <button
                onClick={() => cancelarReserva(r.idReserva)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Cancelar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisClases;
