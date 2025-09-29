import React, { useState } from 'react';
import BrandHeader from '../components/common/BrandHeader';
import BackgroundElements from '../components/common/BackgroundElements';
import NeumorphismCard from '../components/ui/NeumorphismCard';
import LoginAvatar from '../components/auth/LoginAvatar';
import LoginForm from '../components/auth/LoginForm';
import SocialLogin from '../components/auth/SocialLogin';
import OTPVerification from '../components/auth/OTPVerification';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import SuccessMessage from '../components/auth/SuccessMessage';
import ErrorMessage from '../components/common/ErrorMessage';
import { 
  validateLogin, 
  verifyOTP, 
  sendResetPasswordLink, 
  socialLogin,
  saveLoginToken,
  navigateToRoleBasedDashboard,
  resendOTP 
} from '../services/authService';
import '../assets/styles/neumorphism.css';

const LoginPage = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  // Handle main login
  const handleLogin = async (formData) => {
    setIsLoading(true);
    setLoginError('');
    setRememberMe(formData.rememberMe);

    try {
      const user = await validateLogin(formData.email, formData.password);
      
      // Check if OTP is required
      if (user.requireOTP) {
        setUserRole(user);
        setShowOTP(true);
      } else {
        // No OTP required, proceed to dashboard
        saveLoginToken(user, formData.rememberMe);
        setUserRole(user);
        setShowSuccess(true);
        
        setTimeout(() => {
          navigateToRoleBasedDashboard(user.role);
          // GỌI CALLBACK ĐỂ CHUYỂN TRANG
          onLoginSuccess(user);
        }, 2500);
      }
    } catch (error) {
      setLoginError('Sai tên đăng nhập hoặc mật khẩu. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification
  const handleOTPVerify = async (otpCode) => {
    setIsLoading(true);
    setLoginError('');

    try {
      await verifyOTP(otpCode);
      
      saveLoginToken(userRole, rememberMe);
      setShowOTP(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        navigateToRoleBasedDashboard(userRole.role);
        // GỌI CALLBACK ĐỂ CHUYỂN TRANG
        onLoginSuccess(userRole);
      }, 2500);
    } catch (error) {
      setLoginError('Mã OTP không chính xác. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP resend
  const handleOTPResend = async () => {
    setLoginError('');
    try {
      await resendOTP(userRole.email || 'user@evdealer.com');
      alert('Mã OTP mới đã được gửi!');
    } catch (error) {
      setLoginError('Không thể gửi lại OTP. Vui lòng thử lại.');
    }
  };

  // Handle back from OTP
  const handleOTPBack = () => {
    setShowOTP(false);
    setUserRole(null);
    setLoginError('');
  };

  // Handle forgot password
  const handleForgotPassword = async (data) => {
    if (!data.email) {
      setLoginError('Vui lòng nhập email để reset mật khẩu');
      return;
    }

    setIsLoading(true);
    setLoginError('');

    try {
      const result = await sendResetPasswordLink(data.email, data.method);
      alert(`Đã gửi link reset mật khẩu qua ${data.method === 'email' ? 'email' : 'SMS'}: ${data.email}`);
      setShowForgotPassword(false);
    } catch (error) {
      setLoginError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle social login
  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    setLoginError('');
    
    try {
      const user = await socialLogin(provider);
      
      saveLoginToken(user, false);
      setUserRole(user);
      setShowSuccess(true);
      
      setTimeout(() => {
        navigateToRoleBasedDashboard(user.role);
        // GỌI CALLBACK ĐỂ CHUYỂN TRANG
        onLoginSuccess(user);
      }, 2500);
    } catch (error) {
      setLoginError(`Đăng nhập ${provider} thất bại. Vui lòng thử lại.`);
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