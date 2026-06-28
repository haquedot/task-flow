import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // We can add auth tokens here if authentication is added later
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalize and format api errors
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    
    // Create a normalized error object
    const normalizedError = {
      message,
      status: error.response?.status,
      errors: error.response?.data?.errors || null,
    };
    
    return Promise.reject(normalizedError);
  }
);

export default api;
