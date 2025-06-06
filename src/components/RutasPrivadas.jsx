import { Navigate, Outlet } from "react-router-dom";

function RutaPrivada({ rolPermitido }) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // Si no hay sesión iniciada
  if (!usuario) {
    return <Navigate to="/" />;
  }

  // En caso de que no tenga el rol..
  if (rolPermitido && usuario.rol !== rolPermitido) {
    return <Navigate to="/" />;
  }

  // permite acceso a la ruta
  return <Outlet />;
}

export default RutaPrivada;
