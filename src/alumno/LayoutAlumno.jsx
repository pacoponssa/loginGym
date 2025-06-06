
import React from "react";
import { Outlet, Link } from "react-router-dom";

function LayoutAlumno() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-indigo-600 text-white px-6 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">Panel Alumno</h1>
        <div className="space-x-4">
          <Link to="/alumno/reservar" className="hover:underline">
            Reservar
          </Link>
          <Link to="/logout" className="hover:underline">
            Cerrar sesión
          </Link>
        </div>
      </nav>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default LayoutAlumno;
