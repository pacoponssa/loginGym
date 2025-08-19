import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const FormularioReservas = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [horarios, setHorarios] = useState([]);

  const [reserva, setReserva] = useState({
    idUsuario: "",
    idHorario: "",
  });

  useEffect(() => {
    axios.get("/usuario").then((res) => setUsuarios(res.data.data));
    axios.get("/horario").then((res) => setHorarios(res.data.data));

    if (id !== "nueva") {
      const fetchReserva = async () => {
        try {
          setLoading(true);
          const respuesta = await axios.get(`/reserva/${id}`);
          setReserva(respuesta.data.data);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };
      fetchReserva();
    }
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setReserva({ ...reserva, [name]: Number(value) });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (id === "nueva") {
        await axios.post("/reserva", reserva);
      } else {
        await axios.put(`/reserva/${id}`, reserva);
      }
      navigate("/admin/reservas");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <div className="p-6 text-2xl font-bold text-center text-white bg-red-600">
        {id !== "nueva" ? "Editar Reserva" : "Crear Nueva Reserva"}
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="max-w-md p-5 mx-auto mt-10 bg-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Usuario:
              </label>
              <select
                name="idUsuario"
                value={reserva.idUsuario}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Seleccione un usuario</option>
                {usuarios.map((u) => (
                  <option key={u.idUsuario} value={u.idUsuario}>
                    {u.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Horario:
              </label>
              <select
                name="idHorario"
                value={reserva.idHorario}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Seleccione un horario</option>
                {horarios.map((h) => (
                  <option key={h.idHorario} value={h.idHorario}>
                    {`${h.fecha.slice(0, 10)} - ${h.horaInicio}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="px-4 py-2 mx-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/reservas")}
                className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
};

export default FormularioReservas;
