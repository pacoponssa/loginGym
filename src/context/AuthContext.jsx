import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("accessToken") || null
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("usuario")) || null
  );
  const [logoutCallback, setLogoutCallback] = useState(() => () => {});

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("usuario");

    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Normalización
      const normalizedUser = {
        ...parsedUser,
        id: parsedUser.idUsuario,
      };
      setUser(normalizedUser);
    }
  }, []);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            await refreshToken();
            const newToken = localStorage.getItem("accessToken");
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newToken}`;
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return axios(originalRequest);
          } catch (err) {
            logout();
            return Promise.reject(err);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const login = async (dni, password) => {
    const response = await axios.post(
      "http://localhost:3000/auth/login",
      { dni, password },
      { withCredentials: true }
    );

    const accessToken = response.data.accessToken;
    const rawUser = response.data.usuario;

    // ✅ Normalizamos para tener .id
    const user = {
      ...rawUser,
      id: rawUser.idUsuario,
    };

    setToken(accessToken);
    setUser(user);

    localStorage.setItem("accessToken", accessToken);
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
      rol: 1,
    });

    const user = response.data.user;
    setUser(user);
    localStorage.setItem("usuario", JSON.stringify(user));
    return user;
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/refresh",
        {},
        { withCredentials: true }
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
    setUser(null);
    localStorage.clear();
    delete axios.defaults.headers.common["Authorization"];
    logoutCallback();
  };

  useEffect(() => {
    const interval = setInterval(refreshToken, 14 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, user, login, logout, register, setLogoutCallback }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
