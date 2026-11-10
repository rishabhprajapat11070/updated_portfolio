import axios from "axios";

// const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
export const adminApi = axios.create({
  baseURL:  import.meta.env.VITE_API_URL,
});



adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) config.headers.Authorization = `Token ${token}`;
  return config;
});

export default adminApi;



