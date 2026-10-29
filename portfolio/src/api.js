import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Public: visitors ke liye, token nahi bhejta (hidden sections kabhi nahi aate)
export const publicApi = axios.create({ baseURL });

// Admin: har request mein token lagata hai
export const adminApi = axios.create({ baseURL });

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) config.headers.Authorization = `Token ${token}`;
  return config;
});