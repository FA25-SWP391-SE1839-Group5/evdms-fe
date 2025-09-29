import React, { useState, useRef } from 'react';
import { Shield } from 'lucide-react';
import NeumorphismButton from '../ui/NeumorphismButton';

const OTPVerification = ({ onVerify, onResend, onBack, isLoading }) => {
    const [otpCode, setOtpCode] = useState('');
    const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

    const handleOTPChange = (index, value) => {
        if (value.length > 1) return;
    
        const newOTP = otpCode.split('');
        newOTP[index] = value;
        setOtpCode(newOTP.join(''));
    
        if (value && index < 5) {
        otpRefs[index + 1].current?.focus();
    }
};

const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
        otpRefs[index - 1].current?.focus();
    }
};

const handleSubmit = () => {
    if (otpCode.length === 6) {
      onVerify(otpCode);
    }
};

return (
    <>
        <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center neu-icon">
                <Shield className="w-8 h-8 text-green-600" />
            </div>
        </div>

        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Xác thực OTP</h2>
            <p className="text-gray-500">Nhập mã OTP 6 số đã được gửi đến thiết bị của bạn</p>
        </div>

        {/* OTP Input */}
        <div className="flex justify-center space-x-3 mb-6">
            {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                    key={index}
                    ref={otpRefs[index]}
                    type="text"
                    maxLength="1"
                    value={otpCode[index] || ''}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleOTPKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-bold bg-transparent border-none outline-none neu-input rounded-xl"
                    style={{
                        background: '#e0e5ec',
                        boxShadow: 'inset 4px 4px 8px #bec3cf, inset -4px -4px 8px #ffffff'
                    }}
                />
            ))}
        </div>

        {/* Submit OTP */}
        <NeumorphismButton
            onClick={handleSubmit}
            disabled={isLoading || otpCode.length !== 6}
            size="full"
            className="mb-4"
        >
            {isLoading ? (
            <>
                <div className="spinner"></div>
                <span>Đang xác thực...</span>
            </>
            ) : (
            <span>Xác thực OTP</span>
            )}
        </NeumorphismButton>

        {/* Actions */}
        <div className="text-center space-y-3">
            <button
                onClick={onResend}
                className="text-blue-600 hover:text-blue-800 transition-colors font-medium text-sm"
            >
                Gửi lại mã OTP
            </button>
            <div>
                <button
                    onClick={onBack}
                    className="text-gray-500 hover:text-gray-700 transition-colors font-medium text-sm"
                >
                    ← Quay lại đăng nhập
                </button>
             </div>
        </div>
    </>
    );
};

export default OTPVerification