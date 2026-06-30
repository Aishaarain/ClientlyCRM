import axios from 'axios';

const VITE_API_URL = 'https://cliently-backend.vercel.app/api/v1';

const api = axios.create({
  baseURL: VITE_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('velora_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('velora_token');
      localStorage.removeItem('velora_user');
      window.dispatchEvent(new Event('velora:logout'));
    }
    return Promise.reject(err);
  }
);

export { VITE_API_URL };
export default api;
