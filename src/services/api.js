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
        // Get token from localStorage
        const token = localStorage.getItem('evdms_auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response Interceptor - Handle errors & refresh token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.message || error.message;

            switch (status) {
                case 401: {
                    // CHỈ redirect khi KHÔNG phải login request
                    const isLoginRequest = originalRequest.url?.includes('/auth/login');
                    
                    if (isLoginRequest) {
                        // KHÔNG redirect nếu đang login - chỉ throw error
                        return Promise.reject(error);
                    }

                    // Unauthorized - try to refresh token
                    if (!originalRequest._retry) {
                        originalRequest._retry = true;
                        
                        try {
                            const refreshToken = localStorage.getItem('evdms_refresh_token');
                            if (refreshToken) {
                                // Call refresh token API
                                const response = await axios.post(
                                    `${API_BASE_URL}/auth/refresh`,
                                    { refreshToken },
                                    { withCredentials: true }
                                );

                                if (response.data.success) {
                                    const { accessToken } = response.data.data;
                                    localStorage.setItem('evdms_auth_token', accessToken);
                                    
                                    // Retry original request with new token
                                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                                    return api(originalRequest);
                                }
                            }
                        } catch (refreshError) {
                            console.error('Token refresh failed:', refreshError);
                        }
                    }
                    
                    // If refresh failed or no refresh token, clear and redirect
                    console.error('Session expired - please login again');
                    localStorage.removeItem('evdms_auth_token');
                    localStorage.removeItem('evdms_refresh_token');
                    localStorage.removeItem('evdms_user');
                    window.location.href = '/';
                    break;
                }

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
            console.error('Network error - no response from server');
        } else {
            console.error('Request setup error:', error.message);
        }
        
        return Promise.reject(error);
    }
);

export default api;