import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { startOfWeek, endOfWeek, isWithinInterval, parseISO } from "date-fns";

function ReservarClase() {
  const [plan, setPlan] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [idHorario, setIdHorario] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [misReservas, setMisReservas] = useState([]);
  const [reservasFuturas, setReservasFuturas] = useState([]);
  const [disciplinaFiltro, setDisciplinaFiltro] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [disciplinasInscriptas, setDisciplinasInscriptas] = useState([]);

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

    axios
      .get(`/planAlumno/${idUsuario}`)
      .then((res) => setPlan(res.data))
      .catch(() => console.log("No se pudo cargar el plan del alumno"));

    axios
      .get(`/inscripcion/${idUsuario}/disciplina`)
      .then((res) => {
        const ids = res.data.data.map((i) => i.idDisciplina);
        setDisciplinasInscriptas(ids);
      })
      .catch(() => console.log("No se pudieron cargar inscripciones"));

    if (idUsuario) {
      axios
        .get(`/reserva/usuario/${idUsuario}`)
        .then((res) => {
          const reservas = res.data.data;

          setMisReservas(reservas.map((r) => r.idHorario));
          setReservasFuturas(
            reservas.map((r) => ({
              idReserva: r.idReserva,
              idHorario: r.idHorario,
              fechaReserva: r.fechaReserva,
              ...r.Horario,
              Disciplina: r.Horario?.Disciplina,
            }))
          );
        })
        .catch(() => console.log("No se pudieron cargar reservas previas"));
    }
  }, [idUsuario]);

  const getReservasEstaSemana = () => {
    const hoy = new Date();
    const inicio = startOfWeek(hoy, { weekStartsOn: 1 }); // lunes
    const fin = endOfWeek(hoy, { weekStartsOn: 1 }); // domingo

    return reservasFuturas.filter((r) => {
      const fecha = parseISO(r.fecha || r.Horario?.fecha);
      return isWithinInterval(fecha, { start: inicio, end: fin });
    });
  };

  const superoLimiteSemanal =
    plan && getReservasEstaSemana().length >= plan.clasesPorSemana;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (!idUsuario || !idHorario) {
      setError("Seleccione un horario válido");
      return;
    }

    const horarioSeleccionado = horarios.find((h) => h.idHorario === idHorario);
    if (!disciplinasInscriptas.includes(horarioSeleccionado?.idDisciplina)) {
      setError("No estás inscripto en esta disciplina");
      return;
    }

    try {
      const res = await axios.post("/reserva", { idUsuario, idHorario });
      const nuevaReserva = res.data.data;
      const horarioReservado = horarios.find((h) => h.idHorario === idHorario);

      setMensaje("Reserva creada correctamente");
      setIdHorario("");
      setMisReservas([...misReservas, idHorario]);

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

  const safeFormatDate = (fecha) => {
    try {
      return format(new Date(fecha), "dd/MM/yyyy");
    } catch {
      return "Fecha inválida";
    }
  };

  const horariosFiltrados = horarios.filter((h) => {
    const coincideDisciplina =
      !disciplinaFiltro || h.Disciplina?.nombre === disciplinaFiltro;
    const coincideFecha = !fechaFiltro || h.fecha.startsWith(fechaFiltro);
    const estaIncripto = disciplinasInscriptas.includes(h.idDisciplina);
    return coincideDisciplina && coincideFecha && estaIncripto;
  });

  const disciplinasUnicas = [
    ...new Set(horarios.map((h) => h.Disciplina?.nombre).filter(Boolean)),
  ];

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        Reservar Clase
      </h2>

      {mensaje && (
        <p className="mb-4 text-green-600 text-center font-semibold">
          {mensaje}
        </p>
      )}
      {error && (
        <p className="mb-4 text-red-500 text-center font-semibold">{error}</p>
      )}

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
        <select
          className="mb-2 sm:mb-0 border p-2 rounded w-full sm:w-auto"
          value={disciplinaFiltro}
          onChange={(e) => setDisciplinaFiltro(e.target.value)}
        >
          <option value="">Todas las disciplinas</option>
          {disciplinasUnicas.map((d, i) => (
            <option key={i} value={d}>
              {d}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="border p-2 rounded w-full sm:w-auto"
          value={fechaFiltro}
          onChange={(e) => setFechaFiltro(e.target.value)}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300 rounded">
            <thead>
              <tr className="bg-indigo-100 text-gray-700 text-sm uppercase">
                <th className="p-2 border">Disciplina</th>
                <th className="p-2 border">Fecha</th>
                <th className="p-2 border">Inicio</th>
                <th className="p-2 border">Fin</th>
                <th className="p-2 border">Cupo</th>
                <th className="p-2 border">Acción</th>
              </tr>
            </thead>
            <tbody>
              {horariosFiltrados.map((h, i) => {
                const completo = h.reservasHechas >= h.cupoMaximo;
                const yaReservado = misReservas.includes(h.idHorario);
                const estaSeleccionado = idHorario === h.idHorario;

                return (
                  <tr
                    key={h.idHorario}
                    className={`text-center text-sm ${
                      completo
                        ? "bg-gray-100 text-gray-500"
                        : i % 2 === 0
                        ? "bg-white"
                        : "bg-gray-50"
                    }`}
                  >
                    <td className="p-2 border">
                      {h.Disciplina?.nombre || "Disciplina"}
                    </td>
                    <td className="p-2 border">{safeFormatDate(h.fecha)}</td>
                    <td className="p-2 border">{h.horaInicio}</td>
                    <td className="p-2 border">{h.horaFin}</td>
                    <td className="p-2 border font-medium">
                      {h.reservasHechas}/{h.cupoMaximo}
                    </td>
                    <td className="p-2 border">
                      {yaReservado ? (
                        <span className="text-blue-600 font-semibold">
                          Reservado
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIdHorario(h.idHorario)}
                          className={`px-3 py-1 rounded text-white font-semibold ${
                            estaSeleccionado
                              ? "bg-yellow-600 hover:bg-yellow-700"
                              : completo
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

        {plan && idHorario && (
          <div className="flex flex-col items-center mt-6 space-y-2">
            {superoLimiteSemanal && (
              <p className="text-red-500 font-semibold text-center">
                Ya alcanzaste el máximo de {plan.clasesPorSemana} clases esta
                semana.
              </p>
            )}

            <button
              type="submit"
              className="px-6 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={superoLimiteSemanal}
            >
              Confirmar Reserva
            </button>
          </div>
        )}
      </form>

      {reservasFuturas.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-4 text-center text-gray-700">
            Mis reservas futuras
          </h3>
          <ul className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
            {reservasFuturas.map((r, index) => (
              <li
                key={index}
                className="border border-gray-300 rounded p-4 bg-indigo-50 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-indigo-700">
                    {r.Disciplina?.nombre ||
                      r.Horario?.Disciplina?.nombre ||
                      "Disciplina"}
                  </p>
                  <p className="text-sm text-gray-700">
                    {safeFormatDate(r.fecha || r.Horario?.fecha)} de{" "}
                    {r.horaInicio} a {r.horaFin}
                  </p>
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

export default ReservarClase;
