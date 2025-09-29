import React from 'react';
import { Zap } from 'lucide-react';
import NeumorphismButton from '../ui/NeumorphismButton';

const BrandHeader = () => {
    return (
        <div className="mb-8">
            <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 rounded-2xl flex items-center justify-center mr-4 neu-icon">
                    <img 
                        src="src/assets/favicon.png"  
                        alt="Logo" 
                        className="w-12 h-12 object-cover rounded-xl" 
                    />
                </div>
                <div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        Elecar Dealer
                    </h1>
                    <p className="text-lg text-gray-600 mt-1">
                        Hệ thống quản lý đại lý xe điện
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BrandHeader; 