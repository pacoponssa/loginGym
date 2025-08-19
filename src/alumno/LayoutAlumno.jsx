import { NavLink, Outlet } from "react-router-dom";

export default function LayoutAlumno() {
  return (
    <div className="p-4">
      <nav className="mb-4 flex gap-4">
        <NavLink to="" className="text-blue-600">
          Inicio
        </NavLink>
        <NavLink to="misClases" className="text-blue-600">
          Mis Clases
        </NavLink>
        <NavLink to="misInscripciones" className="text-blue-600">
          Mis Disciplinas
        </NavLink>
        <NavLink to="reservar" className="text-blue-600">
          Reservar Clase
        </NavLink>
        <NavLink to="miPlan" className="text-blue-600">
          Mi Plan
        </NavLink>
      </nav>

      <Outlet />
    </div>
  );
}
