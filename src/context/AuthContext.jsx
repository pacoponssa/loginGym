// en este archivo se maneja la autenticación del usuario

import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  const login = async (email, password) => {
    const response = await axios.post("http://localhost:3000/auth/login", {
      email,
      password,
    });
    const token = response.data.accessToken;
    const user = response.data.usuario;

    setToken(token);
    localStorage.setItem("accessToken", token);
    localStorage.setItem("usuario", JSON.stringify(user)); // para usar su rol

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    console.log("Usuario logueado:", user);
  };

  const register = async (email, password, nombre, telefono) => {
    const response = await axios.post("http://localhost:3000/auth/register", {
      email,
      password,
      nombre,
      telefono,
      rol: 1, // siempre rol alumno
    });

    const user = response.data.user;
    localStorage.setItem("usuario", JSON.stringify(user));
    return user;
  };

  const refreshToken = async () => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      console.log("llega a refrescar", storedToken);
      try {
        const response = await axios.post("http://localhost:3000/auth/login", {
          token: storedToken,
        });
        const newAccessToken = response.data.accessToken;
        console.log("respuesta de refrescar", newAccessToken);
        setToken(newAccessToken);
        localStorage.setItem("accessToken", newAccessToken);
      } catch (error) {
        console.error("Error al refrescar el token", error);
        logout();
      }
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("accessToken");
    delete axios.defaults.headers.common["Authorization"];
  };

  useEffect(() => {
    console.log("llega a refrescar", token);
    if (!token && localStorage.getItem("accessToken")) {
      refreshToken();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
