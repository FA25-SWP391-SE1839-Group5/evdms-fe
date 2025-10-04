import api from './api';

// ============================================
// ROLE-BASED ROUTING
// ============================================
export const roleRoutes = {
  admin: '/admin/dashboard',
  dealer_manager: '/manager/dashboard',
  dealer_staff: '/staff/dashboard',
  evm_staff: '/vehicle-models'
};

// ============================================
// TOKEN MANAGEMENT
// ============================================
const TOKEN_KEY = 'evdms_auth_token';
const USER_KEY = 'evdms_user';
const REFRESH_KEY = 'evdms_refresh_token';

export const saveLoginToken = (userData) => {
  // Hỗ trợ dữ liệu phẳng (id, fullName, email, ...)
  if (!userData || !userData.accessToken || !userData.id) {
    console.error('Invalid userData structure:', userData);
    throw new Error('Invalid login data');
  }

  // Chuẩn hoá object user để frontend dễ xử lý
  const user = {
    id: userData.id,
    name: userData.fullName,
    email: userData.email,
    role: userData.role || 'admin' // fallback nếu backend chưa trả role
  };

  const tokenData = {
    accessToken: userData.accessToken,
    refreshToken: userData.refreshToken,
    user,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  };

  // ✅ Lưu vào localStorage
  localStorage.setItem(TOKEN_KEY, tokenData.accessToken);
  localStorage.setItem(REFRESH_KEY, tokenData.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  // Set header cho axios
  api.defaults.headers.common['Authorization'] = `Bearer ${tokenData.accessToken}`;

  return tokenData.accessToken;
};

export const getStoredToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const userStr = localStorage.getItem(USER_KEY);
  if (!token || !userStr) return null;

  try {
    const user = JSON.parse(userStr);
    if (!user || !user.email) {
      console.warn('Invalid user data in localStorage');
      clearToken();
      return null;
    }

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return { token, user };
  } catch {
    return null;
  }
};

export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);

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
  if (!refreshToken) throw new Error('No refresh token');

  try {
    const response = await api.post('/auth/refresh', { refreshToken });
    if (response.data.success) {
      const { accessToken, id, fullName, email, role } = response.data.data;

      const user = { id, name: fullName, email, role: role || 'admin' };
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
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      return response.data.data; // dạng phẳng: { id, fullName, email, accessToken, refreshToken }
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
    const response = await api.post('/auth/forgot-password', { email, method });
    if (response.data.success) return response.data;
    throw new Error(response.data.message || 'Failed to send reset link');
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
