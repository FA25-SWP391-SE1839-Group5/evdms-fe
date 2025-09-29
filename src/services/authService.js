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

// Role-based routing
export const roleRoutes = {
    admin: '/admin/dashboard',
    dealer_manager: '/manager/dashboard', 
    dealer_staff: '/staff/dashboard',
    evm_staff: '/evm/dashboard'
};

// Save login token
export const saveLoginToken = (userData, rememberMe = false) => {
    const tokenData = {
        token: `jwt_${Math.random().toString(36).substr(2, 9)}`,
        user: userData,
        expiresAt: new Date(Date.now() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000))
    };
  
  // WARNING: This uses browser storage which is NOT supported in Claude.ai artifacts
  // In a real app, this would work fine. For demo purposes in Claude.ai, this will fail.
  // Users should copy this code to their local environment where browser storage is available.
    try {
        if (rememberMe) {
        localStorage.setItem('evdealer_token', JSON.stringify(tokenData));
        } else {
        sessionStorage.setItem('evdealer_token', JSON.stringify(tokenData));
        }
    } catch (error) {
        console.error('Storage not available:', error);
    }
    return tokenData.token;
};

// Get stored token
export const getStoredToken = () => {
    try {
        const token = localStorage.getItem('evdealer_token') || sessionStorage.getItem('evdealer_token');
        return token ? JSON.parse(token) : null;
    } catch (error) {
        console.error('Storage not available:', error);
        return null;
    }
};

// Clear token (logout)
export const clearToken = () => {
    try {
        localStorage.removeItem('evdealer_token');
        sessionStorage.removeItem('evdealer_token');
    } catch (error) {
        console.error('Storage not available:', error);
    }
};

// Navigate based on user role
export const navigateToRoleBasedDashboard = (role) => {
    const route = roleRoutes[role] || '/dashboard';
    console.log(`Navigating to ${route} for role: ${role}`);
    // In real app: window.location.href = route;
    // Or with React Router: navigate(route);
    return route;
};

// Validate login credentials (mock)
export const validateLogin = async (email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const user = mockUsers[email];
    if (!user || password !== '123456') {
        throw new Error('Invalid credentials');
    }
    
    return user;
};

// Verify OTP (mock)
export const verifyOTP = async (otpCode) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (otpCode !== '123456') {
        throw new Error('Invalid OTP');
    }
    
    return true;
};

// Send reset password link (mock)
export const sendResetPasswordLink = async (email, method) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
        success: true,
        message: `Link đã được gửi qua ${method === 'email' ? 'email' : 'SMS'}`
    };
};

// Social login (mock)
export const socialLogin = async (provider) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
        role: 'dealer_staff',
        name: `${provider} User`,
        requireOTP: false
    };
};