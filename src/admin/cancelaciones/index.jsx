import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CancelacionesIndex() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarCancelaciones = () => {
    axios.get("/cancelacion")
      .then((respuesta) => {
        setLoading(false);
        if (respuesta.status === 200) {
          setData(respuesta.data.data);
        } else {
          console.error("Error al obtener las cancelaciones:", respuesta.statusText);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error al obtener las cancelaciones:", error);
        setError(error.message);
      });
  };

  useEffect(() => {
    setLoading(true);
    cargarCancelaciones();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Cancelaciones</h1>
      <p className="mb-4">Listado de cancelaciones registradas.</p>
      <div className="ml-5">
        <button
          className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700"
          onClick={() => navigate("/admin/cancelaciones/nueva")}
        >
          Registrar Cancelación
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="min-w-full border mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Reserva</th>
              <th className="p-2 border">Motivo</th>
              <th className="p-2 border">Fecha Cancelación</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.idCancelacion} className="text-center border-b">
                <td className="p-2 border">{item.idReserva}</td>
                <td className="p-2 border">{item.motivo}</td>
                <td className="p-2 border">{item.fechaCancelacion?.slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  );
}

export default CancelacionesIndex;