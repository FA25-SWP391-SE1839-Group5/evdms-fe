import React from 'react';

const DemoCredentials = () => {
    return (
        <div className="mt-4 p-3 bg-blue-50 rounded-xl text-xs text-left">
            <p className="font-semibold text-blue-800 mb-1">Demo accounts:</p>
            <p className="text-blue-600">• admin@example.com / admin123 (Admin)</p>
            <p className="text-blue-600">• dealermanager@example.com / manager123 (Manager)</p>
            <p className="text-blue-600">• dealerstaff@example.com / staff123 (Staff)</p>
            <p className="text-blue-600">• evmstaff@example.com / evm123 (EVM Staff)</p>
        </div>
    );
};

export default DemoCredentials;