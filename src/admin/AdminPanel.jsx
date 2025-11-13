import { Outlet, NavLink, useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Panel del Administrador</h1>
          <div className="flex gap-4 items-center">
            <nav className="space-x-4">
              <NavLink
                to="/admin/calendario"
                className={({ isActive }) =>
                  `px-3 py-2 rounded ${
                    isActive ? "bg-blue-600 text-white" : "bg-gray-200"
                  }`
                }
              >
                Calendario
              </NavLink>
              <NavLink
                to="/admin/alumnos"
                className={({ isActive }) =>
                  `px-3 py-2 rounded ${
                    isActive ? "bg-blue-600 text-white" : "bg-gray-200"
                  }`
                }
              >
                Alumnos
              </NavLink>
              <NavLink
                to="/admin/disciplinas"
                className={({ isActive }) =>
                  `px-3 py-2 rounded ${
                    isActive ? "bg-blue-600 text-white" : "bg-gray-200"
                  }`
                }
              >
                Disciplinas
              </NavLink>
              <NavLink
                to="/admin/usuario"
                className={({ isActive }) =>
                  `px-3 py-2 rounded ${
                    isActive ? "bg-blue-600 text-white" : "bg-gray-200"
                  }`
                }
              >
                Usuarios
              </NavLink>
            </nav>
            <button
              onClick={cerrarSesion}
              className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
