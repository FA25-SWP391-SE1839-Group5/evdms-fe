import React, { useState } from 'react';
import { Mail, ChevronRight, CheckCircle } from 'lucide-react';
import NeumorphismButton from '../ui/NeumorphismButton';
import NeumorphismInput from '../ui/NeumorphismInput';

const ForgotPasswordForm = ({ onSubmit, onBack, isLoading }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(false);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        
        if (value && !validateEmail(value)) {
            setError('Please enter a valid email address');
            setIsValidEmail(false);
        } else {
            setError('');
            setIsValidEmail(value && validateEmail(value));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!email) {
            setError('Email is required');
            return;
        }
        
        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        onSubmit({ email });
    };

    return (
        <>
            <div className="flex justify-center mb-8">
                <div className="w-20 h-20 rounded-full flex items-center justify-center neu-icon">
                    <Mail className="w-8 h-8 text-blue-600" />
                </div>
            </div>

            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
                <p className="text-gray-500">
                    Enter your email and we'll send you instructions to reset your password
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                        Email Address
                    </label>
                    <NeumorphismInput icon={Mail} error={error}>
                        <input
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="your-email@company.com"
                            className="flex-1 bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm font-medium"
                            required
                            disabled={isLoading}
                        />
                        {isValidEmail && !isLoading && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                    </NeumorphismInput>
                </div>

                {/* Submit Button */}
                <NeumorphismButton
                    type="submit"
                    size="full"
                    disabled={isLoading || !isValidEmail}
                >
                    {isLoading ? (
                        <>
                            <div className="spinner"></div>
                            <span>Sending...</span>
                        </>
                    ) : (
                        <>
                            <span>Send Reset Link</span>
                            <ChevronRight className="w-4 h-4" />
                        </>
                    )}
                </NeumorphismButton>

                {/* Back to login */}
                <div className="text-center">
                    <button
                        type="button"
                        onClick={onBack}
                        className="text-blue-600 hover:text-blue-800 transition-colors font-medium text-sm"
                        disabled={isLoading}
                    >
                        ← Back to Login
                    </button>
                </div>
            </form>
        </>
    );
};

export default ForgotPasswordForm;