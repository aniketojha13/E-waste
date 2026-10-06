import axios from 'axios';

const API = axios.create({
  // In production builds, VITE_API_URL is set to the API Gateway URL.
  // During local development, Vite proxies /api → localhost:5000, so '/api' works.
  baseURL: import.meta.env.VITE_API_URL || '/api'
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('ewaste_user') || 'null');
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
