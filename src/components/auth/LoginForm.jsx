import React, { useState, useRef } from 'react';
import { Mail, Lock, Eye, EyeOff, Check } from 'lucide-react';
import NeumorphismInput from '../ui/NeumorphismInput';
import NeumorphismButton from '../ui/NeumorphismButton';
import ErrorMessage from '../common/ErrorMessage';
import DemoCredentials from './DemoCredentials';

const LoginForm = ({ onSubmit, onForgotPassword, isLoading, loginError }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return 'Email is required';
        if (!emailRegex.test(email)) return 'Please enter a valid email';
        return null;
    };

    const validatePassword = (password) => {
        if (!password) return 'Password is required';
        if (password.length < 6) return 'Password must be at least 6 characters';
        return null;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleInputBlur = (field) => {
        let error = null;
        if (field === 'email') {
            error = validateEmail(formData.email);
        } else if (field === 'password') {
            error = validatePassword(formData.password);
        }
    
    if (error) {
        setErrors(prev => ({ ...prev, [field]: error }));
        // Add shake animation
        const inputRef = field === 'email' ? emailRef : passwordRef;
        if (inputRef.current) {
            inputRef.current.style.animation = 'gentleShake 0.5s ease-in-out';
            setTimeout(() => {
                if (inputRef.current) inputRef.current.style.animation = '';
            }, 500);
        }
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();
    
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    if (emailError || passwordError) {
        setErrors({
            email: emailError,
            password: passwordError
        });
        return;
    }

    setErrors({});
    onSubmit(formData);
};

return (
    <form onSubmit={handleSubmit} className="space-y-6">
        {/* Demo Credentials */}
        <DemoCredentials />

        {/* Login Error Message */}
        <ErrorMessage message={loginError} />
        {/* Email Input */}
        <NeumorphismInput
            ref={emailRef}
            icon={Mail}
            error={errors.email}
        >
            <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={() => handleInputBlur('email')}
                placeholder="admin@evdealer.com"
                className="flex-1 bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm font-medium"
            />
        </NeumorphismInput>

        {/* Password Input */}
        <NeumorphismInput
            ref={passwordRef}
            icon={Lock}
            error={errors.password}
        >
            <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={() => handleInputBlur('password')}
                placeholder="••••••••"
                className="flex-1 bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm font-medium"
            />
        <NeumorphismButton
            type="button"
            variant="toggle"
            onClick={() => setShowPassword(!showPassword)}
        >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </NeumorphismButton>
    </NeumorphismInput>

    {/* Remember Me & Forgot Password */}
    <div className="flex items-center justify-between text-sm">
        <label className="flex items-center space-x-3 cursor-pointer group">
            <div 
                className={`neu-checkbox w-5 h-5 rounded-lg flex items-center justify-center transition-all duration-200 ${formData.rememberMe ? 'checked' : ''}`}
            >
                <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="sr-only"
                />
                {formData.rememberMe && (
                    <Check className="w-3 h-3 text-green-600" />
                )}
            </div>
            <span className="text-gray-600 group-hover:text-gray-800 transition-colors font-medium">
                Remember me
            </span>
        </label>
        <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors font-medium">
            Quên mật khẩu?
        </a>
    </div>

    {/* Sign In Button */}
    <NeumorphismButton
        type="submit"
        size="full"
        disabled={isLoading}
    >
        {isLoading ? (
            <>
                <div className="spinner"></div>
                <span>Đang đăng nhập...</span>
            </>
        ) : (
            <span>Đăng nhập</span>
        )}
      </NeumorphismButton>            
    </form>
    );
};

export default LoginForm
