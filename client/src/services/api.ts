import axios from 'axios';

// Determine the base URL based on environment
const isDevelopment = process.env.REACT_APP_DEVELOPMENT === 'true';
const baseURL = process.env.REACT_APP_API_URL || 'https://habitnest-hknx.onrender.com';

// Create axios instance with conditional base URL
const api = axios.create({
  // In development, use relative URL as we're typically running on the same origin
  // In production, use the full URL from the environment variable
  baseURL: isDevelopment ? '/api' : `${baseURL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Log the API URL being used (can be removed in production)
console.log(`API is using ${isDevelopment ? 'localhost' : baseURL} (Development: ${isDevelopment})`);

// Request interceptor for adding token
api.interceptors.request.use(
  (config) => {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api; 