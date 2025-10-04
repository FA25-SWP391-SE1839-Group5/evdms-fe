import React, { useState } from 'react';
import { Mail, ChevronRight } from 'lucide-react';
import NeumorphismButton from '../ui/NeumorphismButton';
import NeumorphismInput from '../ui/NeumorphismInput';

const ForgotPasswordForm = ({ onSubmit, onBack, isLoading }) => {
    const [forgotPasswordData, setForgotPasswordData] = useState({
        email: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(forgotPasswordData);
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
                <p className="text-gray-500">Enter your email and we'll send you instructions to reset your password</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <NeumorphismInput icon={Mail}>
            <input
                type="email"
                value={forgotPasswordData.email}
                onChange={(e) => setForgotPasswordData({...forgotPasswordData, email: e.target.value})}
                placeholder="your-email@company.com"
                className="flex-1 bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm font-medium"
                required
            />
            </NeumorphismInput>

            {/* Submit Button */}
            <NeumorphismButton
                type="submit"
                size="full"
                disabled={isLoading}
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
                >
                    ← Back to Login
                </button>
            </div>
        </form>
      </>
    );
};

export default ForgotPasswordForm