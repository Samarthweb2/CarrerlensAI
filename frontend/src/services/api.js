import axios from 'axios';

// Configure FastAPI Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to automatically inject Bearer Token if it exists
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle session expiration redirects automatically
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Invalidate frontend token on JWT expiry/invalid signature
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Auto-redirect to Login
      if (window.location.pathname !== '/login') {
        window.history.pushState({}, '', '/login');
        // Trigger a custom event to update App.jsx router state hook
        window.dispatchEvent(new Event('popstate'));
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
