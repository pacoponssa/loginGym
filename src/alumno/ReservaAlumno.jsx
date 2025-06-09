import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

function ReservaAlumno() {
  const [horarios, setHorarios] = useState([]);
  const [idHorario, setIdHorario] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [misReservas, setMisReservas] = useState([]);
  const [reservasFuturas, setReservasFuturas] = useState([]);

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const idUsuario = usuario?.idUsuario || usuario?.id;

  useEffect(() => {
    axios
      .get("/horario")
      .then((res) => {
        const hoy = new Date();
        const horariosFiltrados = res.data.data
          .filter((h) => new Date(h.fecha) >= hoy)
          .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        setHorarios(horariosFiltrados);
      })
      .catch(() => setError("Error al cargar horarios"));

    if (idUsuario) {
      axios
        .get(`/reserva/usuario/${idUsuario}`)
        .then((res) => {
          const reservas = res.data.data;
          setMisReservas(reservas.map((r) => r.idHorario));
          setReservasFuturas(reservas);
        })
        .catch(() => console.log("No se pudieron cargar reservas previas"));
    }
  }, [idUsuario]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (!idUsuario || !idHorario) {
      setError("Seleccione un horario válido");
      return;
    }

    try {
      const res = await axios.post("/reserva", { idUsuario, idHorario });
      const nuevaReserva = res.data.data;
      const horarioReservado = horarios.find((h) => h.idHorario === idHorario);

      setMensaje("Reserva creada correctamente");
      setIdHorario("");
      setMisReservas([...misReservas, idHorario]);

      // 👇 importante: agregamos el idReserva recibido del backend
      setReservasFuturas([
        ...reservasFuturas,
        {
          ...horarioReservado,
          idReserva: nuevaReserva.idReserva,
          fechaReserva: nuevaReserva.fechaReserva || new Date().toISOString(),
        },
      ]);
    } catch (err) {
      setError(
        "No se pudo realizar la reserva. Verifique disponibilidad o si ya tiene una existente."
      );
    }
  };

  const cancelarReserva = async (idReserva) => {
    try {
      await axios.delete(`/reserva/${idReserva}`);
      setReservasFuturas(
        reservasFuturas.filter((r) => r.idReserva !== idReserva)
      );
      setMisReservas(misReservas.filter((id) => id !== idReserva));
      setMensaje("Reserva cancelada correctamente");
    } catch (error) {
      setError("Error al cancelar la reserva");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Reservar horario</h2>

      {mensaje && (
        <p className="mb-4 text-green-600 text-center font-semibold">
          {mensaje}
        </p>
      )}
      {error && (
        <p className="mb-4 text-red-500 text-center font-semibold">{error}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Disciplina</th>
                <th className="p-2 border">Fecha</th>
                <th className="p-2 border">Inicio</th>
                <th className="p-2 border">Fin</th>
                <th className="p-2 border">Reservas</th>
                <th className="p-2 border">Acción</th>
              </tr>
            </thead>
            <tbody>
              {horarios.map((h) => {
                const completo = h.reservasHechas >= h.cupoMaximo;
                const yaReservado = misReservas.includes(h.idHorario);
                const estaSeleccionado = idHorario === h.idHorario;

                return (
                  <tr
                    key={h.idHorario}
                    className={`text-center ${
                      completo ? "bg-gray-100 text-gray-500" : ""
                    }`}
                  >
                    <td className="p-2 border">
                      {h.Disciplina?.nombre || "Disciplina"}
                    </td>
                    <td className="p-2 border">
                      {format(new Date(h.fecha), "dd/MM/yyyy")}
                    </td>
                    <td className="p-2 border">{h.horaInicio}</td>
                    <td className="p-2 border">{h.horaFin}</td>
                    <td className="p-2 border">
                      {h.reservasHechas}/{h.cupoMaximo}
                    </td>
                    <td className="p-2 border">
                      {yaReservado ? (
                        <span className="text-sm text-blue-600 font-semibold">
                          Reservado
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIdHorario(h.idHorario)}
                          className={`px-3 py-1 rounded text-white font-semibold ${
                            completo
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                          disabled={completo}
                        >
                          {estaSeleccionado
                            ? "Seleccionado"
                            : completo
                            ? "COMPLETO"
                            : "Reservar"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {idHorario && (
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="px-6 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Confirmar Reserva
            </button>
          </div>
        )}
      </form>

      {reservasFuturas.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-4 text-center text-gray-700">
            Mis reservas
          </h3>
          <ul className="space-y-2">
            {reservasFuturas.map((r, index) => (
              <li
                key={index}
                className="border border-gray-300 rounded p-3 bg-gray-50 flex justify-between items-center"
              >
                <div>
                  <strong>{r.Disciplina?.nombre || "Disciplina"}</strong> -{" "}
                  {format(new Date(r.fecha), "dd/MM/yyyy")} {r.horaInicio} a{" "}
                  {r.horaFin}
                </div>
                <button
                  onClick={() => cancelarReserva(r.idReserva)}
                  className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Cancelar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ReservaAlumno;
