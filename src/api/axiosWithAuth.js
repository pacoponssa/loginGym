// src/api/axiosWithAuth.js
import axios from "axios";

const axiosWithAuth = axios.create({
  baseURL: "http://localhost:3000",
});

// Interceptor para agregar accessToken en cada request
axiosWithAuth.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

// Interceptor de respuesta para intentar refrescar si da 401
axiosWithAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el token expiró y no se intentó ya refrescar
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await axios.post("http://localhost:3000/auth/refresh", {
          token: refreshToken,
        });

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // Reintentar con nuevo token
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosWithAuth(originalRequest);
      } catch (refreshError) {
        console.error("Error al refrescar token", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosWithAuth;
