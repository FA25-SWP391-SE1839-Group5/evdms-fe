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
        </>
    );
};