import React from 'react';
import { Check } from 'lucide-react';

const SuccessMessage = ({ userName, userRole }) => {
    const getRoleName = (role) => {
        const roleNames = {
        admin: 'Admin Dashboard',
        dealer_manager: 'Manager Dashboard',
        dealer_staff: 'Staff Dashboard',
        evm_staff: 'EVM Dashboard'
    };
    return roleNames[role] || 'Dashboard';
};

  return (
    <div 
        className="text-center p-10 opacity-100 transform translate-y-0 transition-all duration-500"
        style={{ animation: 'successPulse 0.6s ease-out' }}
    >
        <div className="neu-icon w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-gray-800 text-2xl font-bold mb-2">Login Successfull!</h3>
        <p className="text-gray-500 mb-2">
            Welcome back, {userName || 'User'}
        </p>
        <p className="text-gray-400 text-sm">
            Redirecting to {getRoleName(userRole)}...
        </p>
    </div>
  );
};

export default SuccessMessage;