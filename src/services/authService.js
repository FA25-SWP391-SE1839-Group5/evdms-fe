import api from './api';

// ============================================
// ROLE-BASED ROUTING - FIXED
// ============================================
export const roleRoutes = {
  admin: '/admin/dashboard',
  dealer_manager: '/manager/dashboard', 
  dealer_staff: '/staff/dashboard',
  evm_staff: '/vehicle-models' // 
};

// ============================================
// TOKEN MANAGEMENT - PERSISTENT STORAGE
// ============================================
const TOKEN_KEY = 'evdms_auth_token';
const USER_KEY = 'evdms_user';
const REFRESH_KEY = 'evdms_refresh_token';

export const saveLoginToken = (userData) => {
  const tokenData = {
    accessToken: userData.accessToken,
    refreshToken: userData.refreshToken,
    user: userData.user,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  };
  
  // ✅ Lưu vào localStorage để persist qua refresh
  localStorage.setItem(TOKEN_KEY, tokenData.accessToken);
  localStorage.setItem(REFRESH_KEY, tokenData.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(userData.user));
  
  // Set header cho API calls
  api.defaults.headers.common['Authorization'] = `Bearer ${tokenData.accessToken}`;

  return tokenData.accessToken;
};

export const getStoredToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const userStr = localStorage.getItem(USER_KEY);
  
  if (!token || !userStr) return null;
  
  try {
    const user = JSON.parse(userStr);
    // Set lại header khi reload
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return { token, user };
  } catch {
    return null;
  }
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_KEY);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(REFRESH_KEY);
  delete api.defaults.headers.common['Authorization'];
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// ============================================
// REFRESH TOKEN
// ============================================
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token');
  }

  try {
    const response = await api.post('/auth/refresh', { refreshToken });
    
    if (response.data.success) {
      const { accessToken, user } = response.data.data;
      localStorage.setItem(TOKEN_KEY, accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      return accessToken;
    }
  } catch (error) {
    clearToken();
    throw error;
  }
};

// ============================================
// NAVIGATION
// ============================================
export const navigateToRoleBasedDashboard = (role) => {
  const route = roleRoutes[role] || '/dashboard';
  console.log(`Navigating to ${route} for role: ${role}`);
  return route;
};

// ============================================
// API CALLS - LOGIN
// ============================================
export const validateLogin = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { 
      email, 
      password 
    });
    
    if (response.data.success) {
      const userData = response.data.data;
      // userData structure: { accessToken, refreshToken, user: { id, email, name, role } }
      return userData;
    } else {
      throw new Error(response.data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.response?.data?.message || 'Invalid credentials');
  }
};

// ============================================
// API CALLS - FORGOT PASSWORD
// ============================================
export const sendResetPasswordLink = async (email, method) => {
  try {
    const response = await api.post('/auth/forgot-password', { 
      email,
      method
    });
    
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to send reset link');
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    throw new Error(error.response?.data?.message || 'Unable to send password reset link');
  }
};

// ============================================
// API CALLS - LOGOUT
// ============================================
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearToken();
  }
};