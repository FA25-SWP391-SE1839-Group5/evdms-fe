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
  saveLoginToken,
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
      // API returns: { accessToken, refreshToken, user: { id, email, name, role } }
      const userData = await validateLogin(formData.email, formData.password);
      
      
      // Save token to localStorage
      saveLoginToken(userData);
      
      setUserRole(userData.user);
      setShowSuccess(true);
      
      // Delay redirect để show success message
      setTimeout(() => {
        // Call App.jsx callback to trigger route change
        onLoginSuccess(userData.user);
      }, 1500);
      
    } catch (error) {
      setLoginError(error.message || 'Invalid email or password. Please try again.');
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
                    ) : (
                      <>
                        <LoginAvatar />

                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome back</h2>
                          <p className="text-gray-500">Please sign in to continue</p>
                        </div>

                        <LoginForm 
                          onSubmit={handleLogin} 
                          onForgotPassword={() => setShowForgotPassword(true)}
                          isLoading={isLoading}
                          loginError={loginError}
                        />
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
                <p className="text-xs text-gray-400">© 2024 EVDMS - Electric Vehicle Dealer Management System</p>
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a>
                  <span>•</span>
                  <a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a>
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