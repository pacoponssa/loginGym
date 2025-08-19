import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("accessToken") || null
  );

  axios.defaults.withCredentials = true;

  const [logoutCallback, setLogoutCallback] = useState(() => () => {});

  // Configurar token en Axios cuando cambia
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
  }, []);

  // Interceptor para refrescar automáticamente
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            await refreshToken(); // Intenta refrescar
            const newToken = localStorage.getItem("accessToken");
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newToken}`;
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return axios(originalRequest); // Reintenta con nuevo token
          } catch (err) {
            logout();
            return Promise.reject(err);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor); // Limpieza
    };
  }, []);

  const login = async (dni, password) => {
    const response = await axios.post(
      "http://localhost:3000/auth/login",
      {
        dni,
        password,
      },
      {
        withCredentials: true, // Permite manejar cookies de sesión
      }
    );

    const accessToken = response.data.accessToken;
    const refreshToken = response.data.refreshToken;
    const user = response.data.usuario;

    setToken(accessToken);
    localStorage.setItem("accessToken", accessToken);
    // localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("usuario", JSON.stringify(user));

    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    console.log("Usuario logueado:", user);
  };

  const register = async (dni, password, nombre, telefono) => {
    const response = await axios.post("http://localhost:3000/auth/register", {
      dni,
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
    // const storedRefreshToken = localStorage.getItem("refreshToken");
    // if (!storedRefreshToken) return;

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/refresh",
        {
          token: storedRefreshToken,
        },
        {
          withCredentials: true,
        }
      );

      const newAccessToken = response.data.accessToken;
      setToken(newAccessToken);
      localStorage.setItem("accessToken", newAccessToken);
    } catch (error) {
      console.error("Error al refrescar el token", error);
      logout();
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
    delete axios.defaults.headers.common["Authorization"];
    logoutCallback(); // Ejecutar lo que se haya definido externamente
  };

  // Refresca token cada 14 minutos
  useEffect(() => {
    const interval = setInterval(refreshToken, 14 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, login, logout, register, setLogoutCallback }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
