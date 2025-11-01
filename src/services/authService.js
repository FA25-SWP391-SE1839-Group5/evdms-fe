import api from './api';

// ============================================
// ROLE-BASED ROUTING
// ============================================
export const roleRoutes = {
  admin: '/admin/dashboard',
  dealer_manager: '/manager/dashboard',
  dealer_staff: '/staff-dashboard',
  staff: '/staff-dashboard',
  evm_staff: '/evm-dashboard'
};

// Decode JWT token to get payload
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

// Normalize role from API to internal format
const normalizeRole = (role) => {
  if (!role) return 'admin';
  
  // Handle "Staff" role specifically
  if (role === 'Staff') return 'staff';
  
  // Convert PascalCase to snake_case
  const normalized = role
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
  
  return normalized;
};

// ============================================
// TOKEN MANAGEMENT
// ============================================
const TOKEN_KEY = 'evdms_auth_token';
const USER_KEY = 'evdms_user';
const REFRESH_KEY = 'evdms_refresh_token';

export const saveLoginToken = (userData) => {
  if (!userData || !userData.accessToken || !userData.id) {
    console.error('Invalid userData structure:', userData);
    throw new Error('Invalid login data');
  }

  console.log('saveLoginToken - userData from API:', userData);
  console.log('saveLoginToken - role from API:', userData.role);

  // Decode JWT to get role (since API doesn't return it in response body)
  let roleFromToken = null;
  const decodedToken = decodeJWT(userData.accessToken);
  if (decodedToken) {
    console.log('saveLoginToken - decoded JWT:', decodedToken);
    roleFromToken = decodedToken.role;
    console.log('saveLoginToken - role from JWT:', roleFromToken);
  }

  // Use role from JWT token, fallback to API response, then default to admin
  const role = roleFromToken || userData.role;

  // Normalize role from API (e.g., "EvmStaff" -> "evm_staff")
  const normalizedRole = normalizeRole(role);

  console.log('saveLoginToken - normalized role:', normalizedRole);

  const user = {
    id: userData.id,
    name: userData.fullName,
    email: userData.email,
    role: normalizedRole,
  };

  console.log('saveLoginToken - user object to save:', user);

  const tokenData = {
    accessToken: userData.accessToken,
    refreshToken: userData.refreshToken,
    user,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  };

  localStorage.setItem(TOKEN_KEY, tokenData.accessToken);
  localStorage.setItem(REFRESH_KEY, tokenData.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

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

      // Normalize role from API
      const normalizedRole = normalizeRole(role);

      const user = { id, name: fullName, email, role: normalizedRole };
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
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Login failed');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Invalid credentials');
  }
};

// ============================================
// API CALLS - FORGOT PASSWORD
// ============================================
export const sendResetPasswordLink = async (email) => {
  try {
    const response = await api.post('/auth/request-password-reset', { 
      email 
    });
    
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message || 'Failed to send reset link');
  } catch (error) {
    console.error('Forgot password error:', error);
    throw new Error(
      error.response?.data?.message || 
      'Unable to send password reset link. Please try again.'
    );
  }
};

// ============================================
// API CALLS - RESET PASSWORD
// ============================================
export const resetPassword = async (token, newPassword, confirmNewPassword) => {
  try {
    const response = await api.post(`/auth/reset-password?token=${token}`, {
      oldPassword: "Dummy@123", // Dummy password with uppercase, lowercase, number, special char - min 6 chars
      newPassword,
      confirmNewPassword
    });

    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message || "Password reset failed");
  } catch (error) {
    console.error("Reset password error:", error);
    
    const errorMessage = error.response?.data?.message || error.message;
    
    if (errorMessage.toLowerCase().includes('expired') || errorMessage.toLowerCase().includes('invalid token')) {
      throw new Error("Reset link has expired or is invalid. Please request a new one.");
    } else if (errorMessage.toLowerCase().includes('password')) {
      throw new Error(errorMessage);
    } else {
      throw new Error("Unable to reset password. Please try again later.");
    }
  }
};

// ============================================
// API CALLS - LOGOUT
// ============================================
export const logout = async () => {
  try {
    await api.post('/auth/logout', {
      refreshToken: getRefreshToken(),
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearToken();
  }
};