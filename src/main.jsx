import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./components/Login";
import { Navigate } from "react-router-dom";


import "./index.css";
// admin
import Dashboard from "./admin/Dashboard";
import AdminPanel from "./admin/AdminPanel";
import HorariosIndex from "./admin/horarios/index";
import FormularioHorarios from "./admin/horarios/formulario";
import ReservasIndex from "./admin/reservas";
import FormularioReservas from "./admin/reservas/formulario";
import FormularioCancelaciones from "./admin/cancelaciones/formulario";
import CancelacionesIndex from "./admin/cancelaciones";
import CalendarioAdmin from "./admin/CalendarioAdmin";
import DisciplinasAdmin from "./admin/disciplinas/DisciplinasAdmin";
import FormularioDisciplinas from "./admin/disciplinas/FormularioDisciplinas";
import AlumnosAdmin from "./admin/alumnos/AlumnosAdmin";
import FormularioAlumno from "./admin/alumnos/FormularioAlumno";
import AsignarDisciplinas from "./admin/alumnos/AsignarDisciplinas";
import AsignarPlan from "./admin/alumnos/AsignarPlan";
import ProfesoresAdmin from "./admin/profesores/ProfesoresAdmin";

// alumno
import LayoutAlumno from "./alumno/LayoutAlumno";
import InicioAlumno from "./alumno/InicioAlumno";
import ReservarClase from "./alumno/ReservarClase";
import DisciplinasAsignadas from "./alumno/DisciplinasAsignadas";
import MiPlan from "./alumno/MiPlan";
import MisClases from "./alumno/MisClases";

import Register from "./components/Register";
import RutaPrivada from "./components/RutasPrivadas";
import { AuthProvider } from "./context/AuthContext";

axios.defaults.baseURL = "http://localhost:3000";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" />, // redirección segura
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  // ADMIN (rol = 2)
  {
    element: <RutaPrivada rolPermitido={2} />,
    children: [
      {
        path: "/admin",
        element: <AdminPanel />,
        children: [
          { path: "", element: <Dashboard /> },
          { path: "alumnos", element: <AlumnosAdmin /> },
          { path: "usuario", element: <FormularioAlumno /> },
          { path: "usuario/:id", element: <FormularioAlumno /> }, // si ya usás FormularioAlumno directamente
          { path: "usuario/:id/disciplinas", element: <AsignarDisciplinas /> },
          { path: "usuario/:id/plan", element: <AsignarPlan /> },


          // Calendario
          { path: "calendario", element: <CalendarioAdmin /> },

          // Disciplinas
          { path: "disciplinas", element: <DisciplinasAdmin /> },
          { path: "disciplinas/nueva", element: <FormularioDisciplinas /> },
          { path: "disciplinas/:id", element: <FormularioDisciplinas /> },

          // Horarios
          { path: "horarios", element: <HorariosIndex /> },
          { path: "horarios/:id", element: <FormularioHorarios /> },

          // Reservas y cancelaciones
          { path: "reservas", element: <ReservasIndex /> },
          { path: "reservas/:id", element: <FormularioReservas /> },
          { path: "cancelaciones", element: <CancelacionesIndex /> },
          { path: "cancelaciones/:id", element: <FormularioCancelaciones /> },

          { path: "profesores", element: <ProfesoresAdmin /> },

        ],
      },
    ],
  },

  // ALUMNO (rol 1)
  {
    element: <RutaPrivada rolPermitido={1} />,
    children: [
      {
        path: "/alumno",
        element: <LayoutAlumno />,
        children: [
          { path: "", element: <InicioAlumno /> },
          { path: "reservar", element: <ReservarClase /> },
          { path: "miPlan", element: <MiPlan /> },
          { path: "misClases", element: <MisClases /> },
          // { path: "inscripciones", element: <InscripcionAlumno /> },
          { path: "misInscripciones", element: <DisciplinasAsignadas /> },
        ],
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
