import axios from 'axios';

const API = axios.create({
  // In production builds, VITE_API_URL is set to the API Gateway URL.
  // During local development, Vite proxies /api → localhost:5000, so '/api' works.
  baseURL: import.meta.env.VITE_API_URL || '/api'
});

API.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('ewaste_user');
    if (raw) {
      const user = JSON.parse(raw);
      const token = user?.token || user?.user?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (e) {
    console.warn('Error reading token from localStorage:', e);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Prevent redirect loops — only redirect once
let isRedirecting = false;

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const currentPath = window.location.pathname;
    const isOnLoginPage = (
      currentPath.includes('/login') ||
      currentPath.includes('/signup') ||
      currentPath.includes('/auth') ||
      currentPath.includes('/apply-as-agent') ||
      currentPath === '/'
    );

    // 401 Unauthorized: token is invalid/expired → clear session and redirect to login
    if (error.response && error.response.status === 401 && !isOnLoginPage && !isRedirecting) {
      isRedirecting = true;
      console.warn('Session expired or invalid token. Redirecting to login.');
      localStorage.removeItem('ewaste_user');
      
      if (currentPath.startsWith('/admin')) {
        window.location.href = '/login/admin';
      } else if (currentPath.startsWith('/agent')) {
        window.location.href = '/login/agent';
      } else {
        window.location.href = '/login';
      }
      // Reset after a delay to allow the redirect
      setTimeout(() => { isRedirecting = false; }, 3000);
    }
    // 403 Forbidden: user is logged in but doesn't have the right role for this endpoint.
    // Do NOT clear session — just reject the promise so the component can show an error.

    return Promise.reject(error);
  }
);

export default API;
