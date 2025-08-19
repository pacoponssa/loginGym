import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const diasSemana = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

export default function FormularioDisciplinas() {
  const navigate = useNavigate();
  const { id } = useParams();
  const esNuevo = id === "nueva";

  const [disciplina, setDisciplina] = useState({
    nombre: "",
    descripcion: "",
    cupoPorTurno: "",
    disponibilidad: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!esNuevo) {
      const fetchDisciplina = async () => {
        setLoading(true);
        try {
          const res = await axios.get(`/disciplina/${id}`);
          const datos = res.data.data;
          setDisciplina({
            nombre: datos.nombre || "",
            descripcion: datos.descripcion || "",
            cupoPorTurno: datos.cupoPorTurno || "",
            disponibilidad: Array.isArray(datos.disponibilidad)
              ? datos.disponibilidad
              : [],
          });
        } catch (err) {
          setError("Error al cargar la disciplina.");
        } finally {
          setLoading(false);
        }
      };
      fetchDisciplina();
    }
  }, [esNuevo, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDisciplina((prev) => ({ ...prev, [name]: value }));
  };

  const handleDisponibilidadChange = (index, campo, valor) => {
    const copia = [...disciplina.disponibilidad];
    copia[index][campo] = valor;
    setDisciplina((prev) => ({ ...prev, disponibilidad: copia }));
  };

  const agregarHorario = () => {
    setDisciplina((prev) => ({
      ...prev,
      disponibilidad: [...prev.disponibilidad, { dia: "", horaInicio: "", horaFin: "" }],
    }));
  };

  const quitarHorario = (index) => {
    const copia = [...disciplina.disponibilidad];
    copia.splice(index, 1);
    setDisciplina((prev) => ({ ...prev, disponibilidad: copia }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const horariosValidos = disciplina.disponibilidad.filter(
      (d) => d.dia && d.horaInicio && d.horaFin
    );

    if (horariosValidos.length !== disciplina.disponibilidad.length) {
      setError("Todos los campos de disponibilidad deben estar completos.");
      return;
    }

    const payload = {
      ...disciplina,
      cupoPorTurno: parseInt(disciplina.cupoPorTurno),
      disponibilidad: horariosValidos,
    };

    try {
      if (esNuevo) {
        await axios.post("/disciplina", payload);
      } else {
        await axios.put(`/disciplina/${id}`, payload);
      }
      navigate("/admin/disciplinas");
    } catch (err) {
      setError("Error al guardar la disciplina.");
    }
  };

  return (
    <div>
      <div className="p-6 text-2xl font-bold text-center text-white bg-red-600">
        {esNuevo ? "Crear Nueva Disciplina" : "Editar Disciplina"}
      </div>
      {loading ? (
        <p className="text-center mt-6">Cargando...</p>
      ) : (
        <div className="max-w-md p-5 mx-auto mt-10 bg-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 font-bold">Nombre:</label>
              <input
                name="nombre"
                type="text"
                value={disciplina.nombre}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-bold">Descripción:</label>
              <textarea
                name="descripcion"
                value={disciplina.descripcion}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-bold">Cupo por turno:</label>
              <input
                name="cupoPorTurno"
                type="number"
                value={disciplina.cupoPorTurno}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-bold">
                Disponibilidad (día y horario):
              </label>
              {disciplina.disponibilidad.map((item, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <select
                    value={item.dia}
                    onChange={(e) => handleDisponibilidadChange(i, "dia", e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="">Día</option>
                    {diasSemana.map((dia) => (
                      <option key={dia} value={dia}>
                        {dia}
                      </option>
                    ))}
                  </select>
                  <input
                    type="time"
                    value={item.horaInicio}
                    onChange={(e) => handleDisponibilidadChange(i, "horaInicio", e.target.value)}
                    className="border p-1 rounded"
                  />
                  <input
                    type="time"
                    value={item.horaFin}
                    onChange={(e) => handleDisponibilidadChange(i, "horaFin", e.target.value)}
                    className="border p-1 rounded"
                  />
                  <button type="button" onClick={() => quitarHorario(i)} className="text-red-600">
                    ✕
                  </button>
                </div>
              ))}
              <button type="button" onClick={agregarHorario} className="text-blue-600 text-sm">
                + Agregar horario
              </button>
            </div>

            <div className="flex justify-center gap-4 mt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/disciplinas")}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </form>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </div>
      )}
    </div>
  );
}
