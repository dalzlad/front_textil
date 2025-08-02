// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000", // Ajusta según tu entorno
});

// Interceptor para agregar token a todas las peticiones
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
