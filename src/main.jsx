import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./components/Login";
import "./index.css";
// admin
import Dashboard from "./admin/Dashboard";
import LayoutAdmin from "./admin/LayoutAdmin";
import DisciplinasIndex from "./admin/disciplinas/index";
import FormularioDisciplinas from "./admin/disciplinas/formulario";
import HorariosIndex from "./admin/horarios/index";
import FormularioHorarios from "./admin/horarios/formulario";
import UsuariosIndex from "./admin/usuarios/index";
import FormularioUsuarios from "./admin/usuarios/formulario";
import ReservasIndex from "./admin/reservas";
import FormularioReservas from "./admin/reservas/formulario";
import FormularioCancelaciones from "./admin/cancelaciones/formulario";
import CancelacionesIndex from "./admin/cancelaciones";
// alumno
import LayoutAlumno from "./alumno/LayoutAlumno"; 
import InicioAlumno from "./alumno/InicioAlumno";
import ReservaAlumno from "./alumno/reservaAlumno";


import Register from "./components/Register"; 
import RutaPrivada from "./components/RutasPrivadas";
import { AuthProvider } from "./context/AuthContext"; 

axios.defaults.baseURL = "http://localhost:3000";

const router = createBrowserRouter([
  {
    path: "/",
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
        element: <LayoutAdmin />,
        children: [
          { path: "", element: <Dashboard /> },
          { path: "usuarios", element: <UsuariosIndex /> },
          { path: "usuarios/:id", element: <FormularioUsuarios /> },
          { path: "disciplinas", element: <DisciplinasIndex /> },
          { path: "disciplinas/:id", element: <FormularioDisciplinas /> },
          { path: "horarios", element: <HorariosIndex /> },
          { path: "horarios/:id", element: <FormularioHorarios /> },
          { path: "reservas", element: <ReservasIndex /> },
          { path: "reservas/:id", element: <FormularioReservas /> },
          { path: "cancelaciones", element: <CancelacionesIndex /> },
          { path: "cancelaciones/:id", element: <FormularioCancelaciones /> },
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
          { path: "reservar", element: <ReservaAlumno /> },
        ],
      },
    ],
  },
]);


//  <Route path="/" element={<Login />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/protected" element={""} />

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
