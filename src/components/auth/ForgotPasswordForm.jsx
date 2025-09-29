import React, { useState } from 'react';
import { Mail, ChevronRight, Check } from 'lucide-react';
import NeumorphismButton from '../ui/NeumorphismButton';
import NeumorphismInput from '../ui/NeumorphismInput';

const ForgotPasswordForm = ({ onSubmit, onBack, isLoading }) => {
    const [forgotPasswordData, setForgotPasswordData] = useState({
        email: '',
        method: 'email'
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
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Quên mật khẩu?</h2>
                <p className="text-gray-500">Nhập email để nhận link reset mật khẩu</p>
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

            {/* Reset Method Selection */}
            <div className="space-y-3">
                <p className="text-sm font-medium text-gray-600">Phương thức nhận link:</p>
                <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="radio"
                            name="method"
                            value="email"
                            checked={forgotPasswordData.method === 'email'}
                            onChange={(e) => setForgotPasswordData({...forgotPasswordData, method: e.target.value})}
                            className="sr-only"
                        />
                        <div 
                            className={`neu-checkbox w-5 h-5 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                forgotPasswordData.method === 'email' 
                                ? 'checked' : ''
                            }`}
                        >
                            {forgotPasswordData.method === 'email' && <Check className="w-3 h-3 text-blue-600" />}
                        </div>
                        <span className="text-gray-600 text-sm">Email</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="radio"
                            name="method"
                            value="sms"
                            checked={forgotPasswordData.method === 'sms'}
                            onChange={(e) => setForgotPasswordData({...forgotPasswordData, method: e.target.value})}
                            className="sr-only"
                        />
                        <div 
                            className={`neu-checkbox w-5 h-5 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                forgotPasswordData.method === 'sms' 
                                ? 'checked' : ''
                            }`}
                        >
                            {forgotPasswordData.method === 'sms' && <Check className="w-3 h-3 text-blue-600" />}
                        </div>
                        <span className="text-gray-600 text-sm">SMS</span>
                    </label>
                </div>
            </div>
        </>
    );
};