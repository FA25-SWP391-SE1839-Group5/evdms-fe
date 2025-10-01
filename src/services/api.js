import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5197/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        // Token is already set in headers by saveLoginToken()
        // But we can also check localStorage as backup
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server responded with error status
            const status = error.response.status;
            const message = error.response.data?.message || error.message;

            switch (status) {
                case 401:
                    // Unauthorized - token expired or invalid
                    console.error('Unauthorized access - please login again');
                    // Clear token and redirect to login
                    delete api.defaults.headers.common['Authorization'];
                    window.location.href = '/login';
                    break;
                case 403:
                    console.error('Forbidden - insufficient permissions');
                    break;
                case 404:
                    console.error('Resource not found');
                    break;
                case 500:
                    console.error('Internal server error');
                    break;
                default:
                    console.error(`API Error (${status}):`, message);
            }
        } else if (error.request) {
            // Request made but no response received
            console.error('Network error - no response from server');
        } else {
            // Something else happened
            console.error('Request setup error:', error.message);
        }
        
        return Promise.reject(error);
    }
);

export default api;