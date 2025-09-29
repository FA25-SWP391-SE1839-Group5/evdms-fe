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
    </>
    );
};

export default OTPVerification