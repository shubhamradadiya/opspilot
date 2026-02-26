// ============================================================================
// IMPORTS
// ============================================================================
import axios from 'axios';

// ============================================================================
// CONSTANTS
// ============================================================================
const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
const ACCESS_TOKEN_KEY = 'accessToken';

// ============================================================================
// AXIOS INSTANCE
// ============================================================================
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// ============================================================================
// REQUEST INTERCEPTOR — Attach Bearer token
// ============================================================================
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ============================================================================
// RESPONSE INTERCEPTOR — Handle 401 globally
// ============================================================================
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      // Redirect to login on unauthorized
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// ============================================================================
// EXPORT
// ============================================================================
export default axiosInstance;
