import api from './api';

// ============================================
// ROLE-BASED ROUTING
// ============================================
export const roleRoutes = {
  admin: '/admin/dashboard',
  dealer_manager: '/manager/dashboard', 
  dealer_staff: '/staff/dashboard',
  evm_staff: '/evm/dashboard'
};

// ============================================
// TOKEN MANAGEMENT (Dùng trong memory thay vì localStorage)
// ============================================
let authToken = null;
let currentUser = null;

export const saveLoginToken = (userData, rememberMe = false) => {
  const tokenData = {
    token: userData.token || `jwt_${Math.random().toString(36).substr(2, 9)}`,
    user: userData,
    expiresAt: new Date(Date.now() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000))
  };
  
  // Lưu vào memory 
  authToken = tokenData.token;
  currentUser = userData;
  
  api.defaults.headers.common['Authorization'] = `Bearer ${tokenData.token}`;

  return tokenData.token;
};

export const getStoredToken = () => {
  return authToken ? { token: authToken, user: currentUser } : null;
};

export const clearToken = () => {
  authToken = null;
  currentUser = null;
  delete api.defaults.headers.common['Authorization'];
};

export const getCurrentUser = () => {
  return currentUser;
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
  // REAL API CALL 
  try {
    const response = await api.post('/auth/login', { 
      email, 
      password 
    });
    
    // Expected response structure:
    // {
    //   success: true,
    //   message: "Login successful",
    //   data: {
    //     token: "jwt_xyz123...",
    //     user: {
    //       id: 1,
    //       email: "admin@example.com",
    //       name: "Admin User",
    //       role: "admin"
    //     }
    //   }
    // }
    
    if (response.data.success) {
      return {
        ...response.data.data.user,
        token: response.data.data.token
      };
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
  // REAL API CALL
  try {
    const response = await api.post('/auth/forgot-password', { 
      email,
      method // 'email' hoặc 'sms'
    });
    
    // Expected response:
    // {
    //   success: true,
    //   message: "Password reset link sent"
    // }

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
    // Optional: Call API to invalidate token on server
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearToken();
  }
};