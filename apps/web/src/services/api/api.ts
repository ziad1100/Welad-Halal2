import axios from 'axios';

// VITE_API_URL already includes /api suffix — join once, never /api/api
const base = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3001/api';
const baseURL = base.replace(/\/+$/, '');

export const api = axios.create({ baseURL });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('wh_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});
