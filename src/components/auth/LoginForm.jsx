import React, { useState, useRef, useEffect } from 'react';
import { Mail, Lock, Check, Eye, EyeOff } from 'lucide-react';
import NeumorphismInput from '../ui/NeumorphismInput';
import NeumorphismButton from '../ui/NeumorphismButton';
import ErrorMessage from '../common/ErrorMessage';
import DemoCredentials from './DemoCredentials';

const LoginForm = ({ onSubmit, onForgotPassword, isLoading, loginError }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [capsLockOn, setCapsLockOn] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    // Detect Caps Lock
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.getModifierState && e.getModifierState('CapsLock')) {
                setCapsLockOn(true);
            } else {
                setCapsLockOn(false);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        window.addEventListener('keyup', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            window.removeEventListener('keyup', handleKeyPress);
        };
    }, []);

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
            <DemoCredentials />
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
                    placeholder="Email address"
                    className="flex-1 bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm font-medium"
                />
            </NeumorphismInput>

            {/* Password Input with Caps Lock Warning */}
            <div className="relative">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        
                    </label>
                    <button
                        type="button"
                        onClick={onForgotPassword}
                        className="text-xs text-gray-500 hover:text-blue-600 transition-colors font-medium"
                    >
                        Forgot Password?
                    </button>
                </div>

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
                        placeholder="Password"
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
                
                {/* Caps Lock Warning - Floating Tooltip Style */}
                {capsLockOn && formData.password && (
                    <div 
                        className="absolute left-0 right-0 -top-2 transform -translate-y-full z-50"
                        style={{ animation: 'fadeIn 0.3s ease-out' }}
                    >
                        <div 
                            className="p-3 rounded-xl flex items-center space-x-3 mx-4"
                            style={{
                                background: '#e0e5ec',
                                boxShadow: '8px 8px 20px #bec3cf, -8px -8px 20px #ffffff',
                            }}
                        >
                            <div 
                                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{
                                    background: '#e0e5ec',
                                    boxShadow: '3px 3px 6px #bec3cf, -3px -3px 6px #ffffff'
                                }}
                            >
                                <i className="ri-alert-line text-amber-600 text-lg"></i>
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-800 text-xs font-bold mb-0.5">Caps Lock is On</p>
                                <p className="text-gray-500 text-xs leading-tight">Having Caps Lock on may cause you to enter your password incorrectly.</p>
                            </div>
                        </div>
                        {/* Arrow pointing down */}
                        <div 
                            className="absolute left-8 -bottom-2 w-4 h-4 transform rotate-45"
                            style={{
                                background: '#e0e5ec',
                                boxShadow: '2px 2px 4px #bec3cf'
                            }}
                        ></div>
                    </div>
                )}
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
                        <span>Signing in...</span>
                    </>
                ) : (
                    <span>Sign In</span>
                )}
            </NeumorphismButton>            
        </form>
    );
};

export default LoginForm;