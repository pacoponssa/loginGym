import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function LayoutAlumno() {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="p-4">
      <nav className="mb-4 flex gap-4 items-center justify-between">
        <div className="flex gap-4">
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
        </div>
        <button
          onClick={cerrarSesion}
          className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
        >
          Cerrar sesión
        </button>
      </nav>

      <Outlet />
    </div>
  );
}
