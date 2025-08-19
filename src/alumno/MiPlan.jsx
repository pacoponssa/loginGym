import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function MiPlan() {
  const { user } = useContext(AuthContext);
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    const obtener = async () => {
      try {
        const res = await axios.get(`/planAlumno/${user.id}`);
        setPlan(res.data);
      } catch (err) {
        console.error("Error al obtener plan:", err);
      }
    };
    if (user?.id) obtener();
  }, [user]);

  if (!plan) return <p className="p-4">No tenés plan asignado.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Mi Plan</h2>
      <p><strong>Clases por semana:</strong> {plan.clasesPorSemana}</p>
      <p><strong>Meses pagados:</strong> {plan.mesesPagados}</p>
      <p><strong>Total de clases:</strong> {plan.totalClases}</p>
      <p><strong>Clases reservadas:</strong> {plan.clasesReservadas}</p>
      <p><strong>Clases restantes:</strong> {plan.totalClases - plan.clasesReservadas}</p>
    </div>
  );
}
