import api from './api';

// ============================================
// MOCK DATA (XÓA KHI CÓ BACKEND THẬT)
// ============================================
const USE_MOCK = true; // Đổi thành false khi có API thật

export const mockUsers = {
  'admin@evdealer.com': { 
    role: 'admin', 
    name: 'System Admin', 
    requireOTP: true 
  },
  'manager@evdealer.com': { 
    role: 'dealer_manager', 
    name: 'Dealer Manager', 
    requireOTP: true 
  },
  'staff@evdealer.com': { 
    role: 'dealer_staff', 
    name: 'Dealer Staff', 
    requireOTP: false 
  },
  'evm@evdealer.com': { 
    role: 'evm_staff', 
    name: 'EVM Staff', 
    requireOTP: false 
  }
};

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
    token: `jwt_${Math.random().toString(36).substr(2, 9)}`,
    user: userData,
    expiresAt: new Date(Date.now() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000))
  };
  
  // Lưu vào memory (không dùng localStorage trong Claude.ai)
  authToken = tokenData.token;
  currentUser = userData;
  
  // Trong production thật, uncomment dòng dưới:
  // localStorage.setItem('evdealer_token', JSON.stringify(tokenData));
  
  return tokenData.token;
};

export const getStoredToken = () => {
  return authToken ? { token: authToken, user: currentUser } : null;
  // Trong production: return JSON.parse(localStorage.getItem('evdealer_token'));
};

export const clearToken = () => {
  authToken = null;
  currentUser = null;
  // Trong production: localStorage.removeItem('evdealer_token');
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
  // Trong production với React Router:
  // navigate(route);
  return route;
};

// ============================================
// API CALLS - LOGIN
// ============================================
export const validateLogin = async (email, password) => {
  if (USE_MOCK) {
    // MOCK: Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const user = mockUsers[email];
    if (!user || password !== '123456') {
      throw new Error('Invalid credentials');
    }
    
    return user;
  }
  
  // REAL API CALL (uncomment khi có backend)
  try {
    const response = await api.post('/auth/login', { 
      email, 
      password 
    });
    
    // Giả sử backend trả về:
    // {
    //   success: true,
    //   data: {
    //     user: { role: 'admin', name: 'Admin', requireOTP: true },
    //     token: 'jwt_xyz123...' (nếu không cần OTP)
    //   }
    // }
    
    return response.data.data.user;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
  }
};

// ============================================
// API CALLS - OTP
// ============================================
export const verifyOTP = async (otpCode, email) => {
  if (USE_MOCK) {
    // MOCK: Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (otpCode !== '123456') {
      throw new Error('Invalid OTP');
    }
    
    return true;
  }
  
  // REAL API CALL
  try {
    const response = await api.post('/auth/verify-otp', { 
      email,
      otp: otpCode 
    });
    
    // Giả sử backend trả về:
    // {
    //   success: true,
    //   data: {
    //     token: 'jwt_xyz123...'
    //   }
    // }
    
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Mã OTP không chính xác');
  }
};

export const resendOTP = async (email) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'OTP đã được gửi lại' };
  }
  
  // REAL API CALL
  try {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể gửi lại OTP');
  }
};

// ============================================
// API CALLS - FORGOT PASSWORD
// ============================================
export const sendResetPasswordLink = async (email, method) => {
  if (USE_MOCK) {
    // MOCK: Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: true,
      message: `Link đã được gửi qua ${method === 'email' ? 'email' : 'SMS'}`
    };
  }
  
  // REAL API CALL
  try {
    const response = await api.post('/auth/forgot-password', { 
      email,
      method // 'email' hoặc 'sms'
    });
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể gửi link reset mật khẩu');
  }
};

// ============================================
// API CALLS - SOCIAL LOGIN
// ============================================
export const socialLogin = async (provider) => {
  if (USE_MOCK) {
    // MOCK: Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      role: 'dealer_staff',
      name: `${provider} User`,
      requireOTP: false
    };
  }
  
  // REAL API CALL
  // Social login thường redirect sang OAuth provider
  // Ví dụ với Google:
  const authUrls = {
    Google: `${api.defaults.baseURL}/auth/google`,
    GitHub: `${api.defaults.baseURL}/auth/github`,
    Twitter: `${api.defaults.baseURL}/auth/twitter`
  };
  
  if (authUrls[provider]) {
    // Redirect to OAuth provider
    window.location.href = authUrls[provider];
  } else {
    throw new Error(`Provider ${provider} không được hỗ trợ`);
  }
};

// ============================================
// API CALLS - LOGOUT
// ============================================
export const logout = async () => {
  try {
    // Optional: Gọi API để invalidate token trên server
    if (!USE_MOCK) {
      await api.post('/auth/logout');
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearToken();
  }
};