import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const DemoCredentials = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mt-4">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-xl text-sm font-semibold text-blue-800 transition-colors"
            >
                <span>View demo accounts</span>
                {isOpen ? (
                    <ChevronUp className="w-4 h-4" />
                ) : (
                    <ChevronDown className="w-4 h-4" />
                )}
            </button>
        
            {isOpen && (
                <div className="mt-4 p-3 bg-blue-50 rounded-xl text-xs text-left">
                    <p className="font-semibold text-blue-800 mb-1">Demo accounts:</p>
                    <p className="text-blue-600">• admin@example.com / admin123 (Admin)</p>
                    <p className="text-blue-600">• dealermanager@example.com / manager123 (Manager)</p>
                    <p className="text-blue-600">• dealerstaff@example.com / staff123 (Staff)</p>
                    <p className="text-blue-600">• evmstaff@example.com / evm123 (EVM Staff)</p>
                </div>
            )}
        </div>
    );
};

export default DemoCredentials;