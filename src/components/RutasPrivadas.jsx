import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RutaPrivada = ({ rolPermitido }) => {
  const { token } = useContext(AuthContext);
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!token || !usuario) {
    return <Navigate to="/" />;
  }

  if (usuario.rol !== rolPermitido) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default RutaPrivada;
