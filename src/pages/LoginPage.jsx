import React, { useState } from 'react';
import BrandHeader from '../components/common/BrandHeader';
import BackgroundElements from '../components/common/BackgroundElements';
import NeumorphismCard from '../components/ui/NeumorphismCard';
import LoginAvatar from '../components/auth/LoginAvatar';
import LoginForm from '../components/auth/LoginForm';
import SocialLogin from '../components/auth/SocialLogin';
import SuccessMessage from '../components/auth/SuccessMessage';
import '../assets/styles/neumorphism.css';

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleLogin = async (FormData) => {
        setIsLoading(true);
        
        try {
        // Simulate login process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success animation
        setShowSuccess(true);
        
        // Simulate redirect after success
        setTimeout(() => {
            console.log('Redirecting to dashboard...');
            // window.location.href = '/dashboard';
        }, 2500);
        
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider) => {
        console.log(`Initiating ${provider} login...`);
        // Implement social login logic
    }

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