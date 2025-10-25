import axios from "axios";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1";

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// 🔐 Request interceptor — ambil token dari localStorage.user
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ⚠️ Response interceptor (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.message) {
      console.error("API Error:", error.response.data.message);
    }
    return Promise.reject(error);
  }
);

export default api;
