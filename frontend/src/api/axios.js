
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('velora_token');  // ← fixed
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('velora_token');  // ← fixed
      localStorage.removeItem('velora_user');   // ← also clear user
      window.dispatchEvent(new Event('velora:logout')); // ← use your logout event instead of hard redirect
    }
    return Promise.reject(err);
  }
);

export { API_URL };
export default api;
