import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  const login = async (username, password) => {
    console.log("llega a login", username, password)
    const response = await axios.post('http://localhost:3000/api/auth/login', { username, password });
    console.log("llega a login", response)
    const accessToken = response.data.accessToken;
    setToken(accessToken);
    localStorage.setItem('accessToken', accessToken);
  };

  const register = async (username, password) => {
    await axios.post('http://localhost:3000/auth/register', { username, password });
  };

  const refreshToken = async () => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      console.log("llega a refrescar", storedToken)
      try {
        const response = await axios.post('http://localhost:3000/auth/refresh', { token: storedToken });
        const newAccessToken = response.data.accessToken;
        console.log("respuesta de refrescar", newAccessToken)
        setToken(newAccessToken);
        localStorage.setItem('accessToken', newAccessToken);
      } catch (error) {
        console.error('Error al refrescar el token', error);
        logout();
      }
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common['Authorization'];
  };

  useEffect(() => {
    console.log("llega a refrescar", token)
    if (!token && localStorage.getItem('accessToken')) {
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
