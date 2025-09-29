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
    navigateToRoleBasedDashboard 
} from '../services/authService';
import '../assets/styles/neumorphism.css';

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [userRole, setUserRole] = useState(null);
    const [rememberMe, setRememberMe] = useState(false);

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
                }, 2500);
            } catch (error) {
                setLoginError('Mã OTP không chính xác. Vui lòng thử lại.');
            } finally {
                setIsLoading(false);
            }
        };

        // Handle OTP resend
        const handleOTPResend = () => {
            console.log('Resending OTP...');
            setLoginError('');
            // Simulate resend
            alert('Mã OTP mới đã được gửi!');
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

            <div 
                className="w-full max-width-md relative z-10" 
                style={{ maxWidth: '420px' }}
            >
                <BrandHeader />

                {/* Main Card */}
                <NeumorphismCard>
                    {!showSuccess ? (
                        <>
                            <LoginAvatar />

                            {/* Welcome Text */}
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Chào mừng trở lại</h2>
                                <p className="text-gray-500">Vui lòng đăng nhập để tiếp tục</p>
                            </div>

                            <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
                            <SocialLogin onSocialLogin={handleSocialLogin} />

                            {/* Footer */}
                            <div className="text-center">
                                <p className="text-gray-500 text-sm">
                                    Chưa có tài khoản?{' '}
                                    <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors font-semibold">
                                        Đăng ký ngay
                                    </a>
                                </p>
                            </div>
                        </>
                    ) : (
                        <SuccessMessage />
                    )}
                </NeumorphismCard>

                {/* Bottom Info */}
                <div className="text-center mt-8 space-y-2">
                    <p className="text-xs text-gray-400">© 2025 Elecar Dealer - Công nghệ xe điện tương lai</p>
                    <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                        <a href="#" className="hover:text-blue-500 transition-colors">Chính sách bảo mật</a>
                        <span>•</span>
                        <a href="#" className="hover:text-blue-500 transition-colors">Điều khoản sử dụng</a>
                    </div>
                </div>
            </div> 
        </div>
    );
};

export default LoginPage;