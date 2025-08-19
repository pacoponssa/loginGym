import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function CalendarioClases() {
  const [eventos, setEventos] = useState([]);
  const { usuario } = useContext(AuthContext);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  useEffect(() => {
    if (!usuario) return;
    cargarReservas();
  }, [usuario]);

  const cargarReservas = () => {
    const idUsuario = usuario?.idUsuario || usuario?.id;

    const diasSemana = {
      Domingo: 0,
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sábado: 6,
    };

    axios
      .get(`/reserva/usuario/${idUsuario}`)
      .then((res) => {
        const eventosFormateados = res.data.data
          .map((item) => {
            const { Horario } = item;
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
              title: Horario?.Disciplina?.descripcion || "Clase",
              start,
              end,
              infoExtra: {
                profesor: Horario.profesor || "No definido",
                disciplina: Horario?.Disciplina?.descripcion || "Clase",
              },
            };
          })
          .filter((e) => e !== null);

        setEventos(eventosFormateados);
      })
      .catch((err) => console.error("Error al cargar clases:", err));
  };

  const manejarSeleccion = (evento) => {
    setEventoSeleccionado(evento);
  };

  const cancelarClase = () => {
    if (!eventoSeleccionado) return;
    axios
      .delete(`/reserva/${eventoSeleccionado.id}`)
      .then(() => {
        alert("Reserva cancelada con éxito");
        setEventoSeleccionado(null);
        cargarReservas(); // recargar calendario
      })
      .catch((err) => {
        console.error("Error al cancelar reserva:", err);
        alert("Hubo un problema al cancelar la clase.");
      });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Mis Clases</h2>
      <Calendar
        localizer={localizer}
        events={eventos}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        views={["month", "week", "day"]}
        defaultView="week"
        onSelectEvent={manejarSeleccion}
      />

      {eventoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-2">
              {eventoSeleccionado.title}
            </h3>
            <p>
              <strong>Inicio:</strong>{" "}
              {moment(eventoSeleccionado.start).format("LLLL")}
            </p>
            <p>
              <strong>Fin:</strong>{" "}
              {moment(eventoSeleccionado.end).format("LLLL")}
            </p>
            <p>
              <strong>Profesor:</strong>{" "}
              {eventoSeleccionado.infoExtra.profesor}
            </p>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={cancelarClase}
              >
                Cancelar Clase
              </button>
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
