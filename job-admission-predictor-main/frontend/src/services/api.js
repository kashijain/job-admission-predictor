import axios from 'axios';

// Use environment variable with /api suffix
const API_URL = import.meta.env.VITE_API_URL + '/api';

console.log('🌐 API Base URL:', API_URL);

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

// Interceptor to attach JWT token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor to handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized - token might be expired
        if (error.response?.status === 401) {
            console.warn('🔐 Unauthorized - Token may be expired');
            localStorage.removeItem('token');
            // Optionally redirect to login
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
