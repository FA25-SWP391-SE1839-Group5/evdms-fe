import React from 'react';

const DemoCredentials = () => {
    return (
        <div className="mt-4 p-3 bg-blue-50 rounded-xl text-xs text-left">
            <p className="font-semibold text-blue-800 mb-1">Demo accounts:</p>
            <p className="text-blue-600">• admin@evdealer.com (Admin + OTP)</p>
            <p className="text-blue-600">• manager@evdealer.com (Manager + OTP)</p>
            <p className="text-blue-600">• staff@evdealer.com (Staff)</p>
            <p className="text-blue-600">• evm@evdealer.com (EVM Staff)</p>
            <p className="text-blue-700 mt-1">Password: 123456, OTP: 123456</p>
        </div>
    );
};

export default DemoCredentials;