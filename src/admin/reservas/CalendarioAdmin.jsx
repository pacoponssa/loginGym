
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function CalendarioAdmin() {
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  useEffect(() => {
    axios
      .get("/reserva")
      .then((res) => {
        const diasSemana = {
          Domingo: 0,
          Lunes: 1,
          Martes: 2,
          Miércoles: 3,
          Jueves: 4,
          Viernes: 5,
          Sábado: 6,
        };

        const eventosFormateados = res.data.data
          .map((item) => {
            const { Horario, Usuario } = item;

            if (!Horario || !Horario.dia || !Horario.horaInicio) return null;

            const dia = Horario.dia;
            const hora = Horario.horaInicio;
            const duracion = Horario.duracion || 60;
            const numeroDia = diasSemana[dia];

            const hoy = moment();
            let proximaClase = hoy.clone().day(numeroDia);
            if (proximaClase.isBefore(hoy, "day")) {
              proximaClase.add(7, "days");
            }

            const [horaH, minM] = hora.split(":");
            const start = proximaClase
              .clone()
              .set({ hour: horaH, minute: minM, second: 0 })
              .toDate();
            const end = moment(start).add(duracion, "minutes").toDate();

            return {
              id: item.idReserva,
              title: `${Horario?.Disciplina?.descripcion} - ${Usuario?.nombre} ${Usuario?.apellido}`,
              start,
              end,
              infoExtra: {
                alumno: Usuario?.nombre || "Desconocido",
                disciplina: Horario?.Disciplina?.descripcion || "Clase",
                profesor: Horario.profesor || "No definido",
              },
            };
          })
          .filter((e) => e !== null);

        setEventos(eventosFormateados);
      })
      .catch((err) => console.error("Error al cargar reservas:", err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Calendario de Reservas</h2>
      <Calendar
        localizer={localizer}
        events={eventos}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        views={["month", "week", "day"]}
        defaultView="week"
        onSelectEvent={(evento) => setEventoSeleccionado(evento)}
      />
      {eventoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-2">
              {eventoSeleccionado.title}
            </h3>
            <p><strong>Inicio:</strong> {moment(eventoSeleccionado.start).format("LLLL")}</p>
            <p><strong>Fin:</strong> {moment(eventoSeleccionado.end).format("LLLL")}</p>
            <p><strong>Alumno:</strong> {eventoSeleccionado.infoExtra.alumno}</p>
            <p><strong>Disciplina:</strong> {eventoSeleccionado.infoExtra.disciplina}</p>
            <p><strong>Profesor:</strong> {eventoSeleccionado.infoExtra.profesor}</p>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setEventoSeleccionado(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
