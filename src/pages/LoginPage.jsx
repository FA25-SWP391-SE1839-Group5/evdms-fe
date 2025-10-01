import React, { useState } from 'react';
import BrandHeader from '../components/common/BrandHeader';
import BackgroundElements from '../components/common/BackgroundElements';
import NeumorphismCard from '../components/ui/NeumorphismCard';
import LoginAvatar from '../components/auth/LoginAvatar';
import LoginForm from '../components/auth/LoginForm';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import SuccessMessage from '../components/auth/SuccessMessage';
import { 
  validateLogin,  
  sendResetPasswordLink, 
  socialLogin,
  saveLoginToken,
  navigateToRoleBasedDashboard, 
} from '../services/authService';
import '../assets/styles/neumorphism.css';

const LoginPage = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [userRole, setUserRole] = useState(null);

  // Handle main login
  const handleLogin = async (formData) => {
    setIsLoading(true);
    setLoginError('');

    try {
      const user = await validateLogin(formData.email, formData.password);
  
        // No OTP required, proceed to dashboard
        saveLoginToken(user, formData.rememberMe);
        setUserRole(user);
        setShowSuccess(true);
        
        setTimeout(() => {
          navigateToRoleBasedDashboard(user.role);
          // GỌI CALLBACK ĐỂ CHUYỂN TRANG
          onLoginSuccess(user);
        }, 2500);
    } catch (error) {
      setLoginError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = async (data) => {
    if (!data.email) {
      setLoginError('Please enter your email to reset password');
      return;
    }

    setIsLoading(true);
    setLoginError('');

    try {
      await sendResetPasswordLink(data.email, data.method);
      alert(`Password reset link sent via ${data.method === 'email' ? 'email' : 'SMS'}: ${data.email}`);
      setShowForgotPassword(false);
    } catch (error) {
      setLoginError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden" 
      style={{ 
        background: '#e0e5ec',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      <BackgroundElements />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex items-center min-h-screen">
          
          {/* Left Side - Logo and Description */}
          <div className="hidden lg:flex lg:w-1/2 lg:pr-12 flex-col">
            <BrandHeader />
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="w-full" style={{ maxWidth: '420px' }}>
              
              {/* Main Card */}
              <NeumorphismCard>
                {!showSuccess ? (
                  <>
                    {showForgotPassword ? (
                      <ForgotPasswordForm
                        onSubmit={handleForgotPassword}
                        onBack={() => setShowForgotPassword(false)}
                        isLoading={isLoading}
                      />
                    ) : showOTP ? (
                      <>
                        <ErrorMessage message={loginError} />
                        <OTPVerification
                          onVerify={handleOTPVerify}
                          onResend={handleOTPResend}
                          onBack={handleOTPBack}
                          isLoading={isLoading}
                        />
                      </>
                    ) : (
                      <>
                        <LoginAvatar />

                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-bold text-gray-800 mb-2">Chào mừng trở lại</h2>
                          <p className="text-gray-500">Vui lòng đăng nhập để tiếp tục</p>
                        </div>

                        <LoginForm 
                          onSubmit={handleLogin} 
                          onForgotPassword={() => setShowForgotPassword(true)}
                          isLoading={isLoading}
                          loginError={loginError}
                        />

                        <SocialLogin onSocialLogin={handleSocialLogin} />

                        <div className="text-center">
                          <p className="text-gray-500 text-sm">
                            Chưa có tài khoản?{' '}
                            <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors font-semibold">
                              Đăng ký ngay
                            </a>
                          </p>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <SuccessMessage 
                    userName={userRole?.name} 
                    userRole={userRole?.role} 
                  />
                )}
              </NeumorphismCard>

              {/* Bottom Info */}
              <div className="text-center mt-8 space-y-2">
                <p className="text-xs text-gray-400">© 2024 EV Dealer Pro - Công nghệ xe điện tương lai</p>
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <a href="#" className="hover:text-blue-500 transition-colors">Chính sách bảo mật</a>
                  <span>•</span>
                  <a href="#" className="hover:text-blue-500 transition-colors">Điều khoản sử dụng</a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;