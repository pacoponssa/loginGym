import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import { format, parse, startOfWeek, getDay } from "date-fns";
import es from "date-fns/locale/es";
import axios from "axios";

const locales = { es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  locales,
  getDay,
});

export default function CalendarioAdmin() {
  const [eventos, setEventos] = useState([]);
  const [filtroDisciplina, setFiltroDisciplina] = useState("");
  const [filtroAlumno, setFiltroAlumno] = useState("");
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  const [view, setView] = useState("week");
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const res = await axios.get("/horario/horariosConAlumnos");
        const datos = res.data;

        const eventosFormateados = datos.map((item) => ({
          title: `${item.nombreDisciplina} - ${item.nombreAlumno}`,
          start: new Date(item.fechaHoraInicio),
          end: new Date(item.fechaHoraFin),
          ...item, // agregamos todo el objeto para usar en el modal
        }));

        setEventos(eventosFormateados);
      } catch (error) {
        console.error("Error cargando eventos:", error);
      }
    };

    fetchEventos();
  }, []);

  const eventosFiltrados = eventos.filter((e) => {
    return (
      (filtroDisciplina === "" || e.nombreDisciplina === filtroDisciplina) &&
      (filtroAlumno === "" || e.nombreAlumno === filtroAlumno)
    );
  });

  const limpiarFiltros = () => {
    setFiltroDisciplina("");
    setFiltroAlumno("");
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Calendario de turnos</h2>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          value={filtroDisciplina}
          onChange={(e) => setFiltroDisciplina(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Todas las disciplinas</option>
          {[...new Set(eventos.map((e) => e.nombreDisciplina))].map((disc) => (
            <option key={disc} value={disc}>
              {disc}
            </option>
          ))}
        </select>

        <select
          value={filtroAlumno}
          onChange={(e) => setFiltroAlumno(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Todos los alumnos</option>
          {[...new Set(eventos.map((e) => e.nombreAlumno))].map((alum) => (
            <option key={alum} value={alum}>
              {alum}
            </option>
          ))}
        </select>

        <button
          onClick={limpiarFiltros}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Limpiar filtros
        </button>
      </div>

      {/* Calendario */}
      <Calendar
        localizer={localizer}
        events={eventosFiltrados}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        views={{ month: true, week: true, day: true }}
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
        messages={{
          today: "Hoy",
          previous: "Anterior",
          next: "Siguiente",
          month: "Mes",
          week: "Semana",
          day: "Día",
          agenda: "Agenda",
          noEventsInRange: "No hay eventos en este rango",
          showMore: (total) => `+ Ver más (${total})`,
        }}
        onSelectEvent={(evento) => setEventoSeleccionado(evento)}
      />

      {/* Modal */}
      {eventoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">Detalles del turno</h3>
            <p>
              <strong>Disciplina:</strong> {eventoSeleccionado.nombreDisciplina}
            </p>
            <p>
              <strong>Alumno:</strong> {eventoSeleccionado.nombreAlumno}
            </p>
            <p>
              <strong>Fecha:</strong>{" "}
              {eventoSeleccionado.start.toLocaleDateString()}
            </p>
            <p>
              <strong>Inicio:</strong>{" "}
              {eventoSeleccionado.start.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p>
              <strong>Fin:</strong>{" "}
              {eventoSeleccionado.end.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            <button
              onClick={() => setEventoSeleccionado(null)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Cerrar
            </button>
            {eventoSeleccionado.idReserva && (
              <button
                onClick={async () => {
                  try {
                    await axios.delete(
                      `/reserva/${eventoSeleccionado.idReserva}`
                    );
                    alert("Reserva cancelada correctamente");
                    setEventos((prev) =>
                      prev.filter(
                        (ev) => ev.idReserva !== eventoSeleccionado.idReserva
                      )
                    );
                    setEventoSeleccionado(null);
                  } catch (error) {
                    console.error("Error al cancelar la reserva:", error);
                    alert("Hubo un error al cancelar la reserva");
                  }
                }}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded ml-2"
              >
                Cancelar reserva
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
