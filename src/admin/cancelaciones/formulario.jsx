import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const FormularioCancelaciones = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reservas, setReservas] = useState([]);

  const [cancelacion, setCancelacion] = useState({
    idReserva: "",
    motivo: "",
    fechaCancelacion: "",
  });

  useEffect(() => {
    axios.get("/reserva").then((res) => setReservas(res.data.data));

    if (id !== "nueva") {
      const fetchCancelacion = async () => {
        try {
          setLoading(true);
          const respuesta = await axios.get(`/cancelacion/${id}`);
          setCancelacion(respuesta.data.data);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };
      fetchCancelacion();
    }
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCancelacion({ ...cancelacion, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (id === "nueva") {
        await axios.post("/cancelacion", cancelacion);
      } else {
        await axios.put(`/cancelacion/${id}`, cancelacion);
      }
      navigate("/admin/cancelaciones");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <div className="p-6 text-2xl font-bold text-center text-white bg-red-600">
        {id !== "nueva" ? "Editar Cancelación" : "Registrar Cancelación"}
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="max-w-md p-5 mx-auto mt-10 bg-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Reserva:
              </label>
              <select
                name="idReserva"
                value={cancelacion.idReserva}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Seleccione una reserva</option>
                {reservas.map((r) => (
                  <option key={r.idReserva} value={r.idReserva}>
                    {`Reserva #${r.idReserva} - Usuario ${r.idUsuario}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Motivo:
              </label>
              <textarea
                name="motivo"
                value={cancelacion.motivo}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows={3}
              ></textarea>
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
                onClick={() => navigate("/admin/cancelaciones")}
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

export default FormularioCancelaciones;
