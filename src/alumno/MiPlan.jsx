import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const MiPlan = () => {
  const { user } = useContext(AuthContext);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const cargarPlan = async () => {
      try {
        const res = await axios.get(`/planAlumno/${user.id}`);
        setPlan(res.data.data);
      } catch (error) {
        console.error("Error al cargar el plan:", error);
        setPlan(null); // En caso de error, aseguramos que no haya plan
      } finally {
        setLoading(false);
      }
    };

    cargarPlan();
  }, [user]);

  if (loading) return <p className="p-4">Cargando plan...</p>;

  if (!plan)
    return <p className="p-4 text-red-500">No tenés plan asignado actualmente.</p>;

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-md mx-auto mt-4">
      <h2 className="text-xl font-semibold mb-4 text-green-700">Mi Plan Actual</h2>
      <p><strong>Nombre:</strong> {plan.nombre}</p>
      <p><strong>DNI:</strong> {plan.dni}</p>
      <p><strong>Clases por semana:</strong> {plan.clasesPorSemana}</p>
      <p><strong>Meses pagados:</strong> {plan.mesesPagados}</p>
      <p><strong>Inicio del plan:</strong> {new Date(plan.fechaInicio).toLocaleDateString()}</p>
      <p><strong>Clases totales:</strong> {plan.totalClases}</p>
      <p><strong>Clases reservadas:</strong> {plan.clasesReservadas}</p>
      <p><strong>Clases restantes:</strong> {plan.clasesRestantes}</p>
    </div>
  );
};

export default MiPlan;
