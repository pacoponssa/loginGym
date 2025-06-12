import React, { useState, useEffect } from "react";
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

const FormularioDisciplinas = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [disciplina, setDisciplina] = useState({
    nombre: "",
    descripcion: "",
    cupoPorTurno: "",
    disponibilidad: [],
  });

  useEffect(() => {
    if (id !== "nueva") {
      const fetchDisciplina = async () => {
        try {
          setLoading(true);
          const respuesta = await axios.get(`/disciplina/${id}`);
          const datos = respuesta.data.data;
          setDisciplina({
            ...datos,
            disponibilidad: Array.isArray(datos.disponibilidad)
              ? datos.disponibilidad
              : Object.entries(datos.disponibilidad || {}).flatMap(
                  ([dia, horas]) =>
                    horas.map((horaInicio) => ({
                      dia: dia.charAt(0).toUpperCase() + dia.slice(1),
                      horaInicio,
                      horaFin: "", // opcional
                    }))
                ),
          });

          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };
      fetchDisciplina();
    } else {
      setDisciplina({
        nombre: "",
        descripcion: "",
        cupoPorTurno: "",
        disponibilidad: [],
      });
    }
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDisciplina({ ...disciplina, [name]: value });
  };

  const handleDisponibilidadChange = (index, campo, valor) => {
    const nueva = [...disciplina.disponibilidad];
    nueva[index][campo] = valor;
    setDisciplina({ ...disciplina, disponibilidad: nueva });
  };

  const agregarDia = () => {
    setDisciplina({
      ...disciplina,
      disponibilidad: [
        ...disciplina.disponibilidad,
        { dia: "", horaInicio: "", horaFin: "" },
      ],
    });
  };

  const quitarDia = (index) => {
    const nueva = [...disciplina.disponibilidad];
    nueva.splice(index, 1);
    setDisciplina({ ...disciplina, disponibilidad: nueva });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const disponibilidadValida = disciplina.disponibilidad.filter(
      (d) => d.dia && d.horaInicio && d.horaFin
    );

    if (disponibilidadValida.length !== disciplina.disponibilidad.length) {
      setError("Todos los campos de disponibilidad deben estar completos.");
      return;
    }

    const datosAGuardar = {
      ...disciplina,
      disponibilidad: disponibilidadValida,
    };

    // console.log("Disponibilidad a guardar:", datosAGuardar.disponibilidad);

    try {
      if (id === "nueva") {
        await axios.post("/disciplina", datosAGuardar);
      } else {
        await axios.put(`/disciplina/${id}`, datosAGuardar);
      }
      navigate("/admin/disciplinas");
    } catch (error) {
      setError("Error al guardar la disciplina: " + error.message);
    }
  };

  return (
    <div>
      <div className="p-6 text-2xl font-bold text-center text-white bg-red-600">
        {id !== "nueva" ? "Editar Disciplina" : "Crear Nueva Disciplina"}
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="max-w-md p-5 mx-auto mt-10 bg-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="nombre"
              >
                Nombre:
              </label>
              <input
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                id="nombre"
                type="text"
                name="nombre"
                value={disciplina.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="descripcion"
              >
                Descripción:
              </label>
              <textarea
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                id="descripcion"
                name="descripcion"
                value={disciplina.descripcion}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="cupoPorTurno"
              >
                Cupo por turno:
              </label>
              <input
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                id="cupoPorTurno"
                type="number"
                name="cupoPorTurno"
                value={disciplina.cupoPorTurno}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Disponibilidad (días y horarios):
              </label>
              {disciplina.disponibilidad.map((item, index) => (
                <div key={index} className="mb-2 flex gap-2">
                  <select
                    value={item.dia}
                    onChange={(e) =>
                      handleDisponibilidadChange(index, "dia", e.target.value)
                    }
                    className="px-2 py-1 border rounded"
                  >
                    <option value="">Día</option>
                    {diasSemana.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <input
                    type="time"
                    value={item.horaInicio}
                    onChange={(e) =>
                      handleDisponibilidadChange(
                        index,
                        "horaInicio",
                        e.target.value
                      )
                    }
                    className="px-2 py-1 border rounded"
                  />
                  <input
                    type="time"
                    value={item.horaFin}
                    onChange={(e) =>
                      handleDisponibilidadChange(
                        index,
                        "horaFin",
                        e.target.value
                      )
                    }
                    className="px-2 py-1 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => quitarDia(index)}
                    className="text-red-600 font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={agregarDia}
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                + Agregar horario
              </button>
            </div>

            {disciplina.disponibilidad.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-bold mb-2 text-gray-600">
                  Previsualización:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {disciplina.disponibilidad.map((d, idx) => (
                    <li key={idx}>
                      {d.dia || "(sin día)"} - {d.horaInicio || "--:--"} a{" "}
                      {d.horaFin || "--:--"}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-center">
              <button
                className="px-4 py-2 mx-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Guardar
              </button>
              <button
                className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => navigate("/admin/disciplinas")}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default FormularioDisciplinas;
