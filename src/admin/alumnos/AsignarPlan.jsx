import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AsignarPlan = () => {
  const { id } = useParams(); // id del usuario
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [clasesPorSemana, setClasesPorSemana] = useState(2);
  const [mesesPagados, setMesesPagados] = useState(1);
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split("T")[0]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const cargarPlan = async () => {
      try {
        const res = await axios.get(`/planAlumno/${id}`);
        if (res.data && res.data.data) {
          setPlan(res.data.data);
          setClasesPorSemana(res.data.data.clasesPorSemana || 2);
          setMesesPagados(res.data.data.mesesPagados || 1);
          setFechaInicio(res.data.data.fechaInicio || new Date().toISOString().split("T")[0]);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setPlan(null); // No hay plan, se puede crear uno nuevo
        } else {
          console.error(err);
          setError("No se pudo cargar el plan del alumno.");
        }
      }
    };

    cargarPlan();
  }, [id]);

  const handleGuardar = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    try {
      const datosPlan = {
        clasesPorSemana,
        mesesPagados,
        fechaInicio,
      };

      if (plan) {
        await axios.put(`/planAlumno/${id}`, datosPlan);
        setMensaje("Plan actualizado correctamente.");
      } else {
        await axios.post("/planAlumno", {
          idUsuario: id,
          ...datosPlan,
        });
        setMensaje("Plan asignado correctamente.");
      }
    } catch (err) {
      console.error(err);
      setError("Error al guardar el plan.");
    }
  };

  const handleEliminar = async () => {
    const confirmar = confirm("¿Estás seguro de eliminar el plan del alumno?");
    if (!confirmar) return;

    try {
      await axios.delete(`/planAlumno/${id}`);
      setPlan(null);
      setClasesPorSemana(2);
      setMesesPagados(1);
      setMensaje("Plan eliminado correctamente.");
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el plan.");
    }
  };

  const calcularFechaFin = () => {
    const fecha = new Date(fechaInicio);
    fecha.setMonth(fecha.getMonth() + mesesPagados);
    return fecha.toLocaleDateString("es-AR");
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-center">
        {plan ? "Editar Plan del Alumno" : "Asignar Plan al Alumno"}
      </h2>

      {mensaje && <p className="text-green-600 text-center mb-2">{mensaje}</p>}
      {error && <p className="text-red-600 text-center mb-2">{error}</p>}

      {plan && (
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-3 rounded text-sm mb-4">
          ⚠️ Al actualizar este plan, se eliminarán y regenerarán todas las reservas futuras del alumno.
        </div>
      )}

      <form onSubmit={handleGuardar} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Clases por semana:</label>
          <input
            type="number"
            min={1}
            max={7}
            value={clasesPorSemana}
            onChange={(e) => setClasesPorSemana(parseInt(e.target.value) || 1)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Duración (meses):</label>
          <input
            type="number"
            min={1}
            value={mesesPagados}
            onChange={(e) => setMesesPagados(parseInt(e.target.value) || 1)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Fecha de inicio:</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <p className="text-sm text-gray-600">
          Este plan finalizará el <strong>{calcularFechaFin()}</strong>.
        </p>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Guardar Plan
          </button>

          {plan && (
            <button
              type="button"
              onClick={handleEliminar}
              className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            >
              Eliminar Plan
            </button>
          )}
        </div>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-600 hover:underline"
        >
          ← Volver
        </button>
      </div>
    </div>
  );
};

export default AsignarPlan;
