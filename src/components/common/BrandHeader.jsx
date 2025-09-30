import React from 'react';
import { Zap } from 'lucide-react';
import NeumorphismButton from '../ui/NeumorphismButton';

const BrandHeader = () => {
    return (
        <div className="mb-8">
            <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-18 h-16">
                    <img 
                        src="src/assets/images/elecar_logo.svg"  
                        alt="Logo" 
                        className="w-18 h-18 object-cover rounded-xl" 
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

            {/* Features List */}
            <div className="space-y-3 text-gray-700">
                <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-lg text-gray-600 mt-1">Quản lý inventory thông minh</span>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-lg text-gray-600 mt-1">Theo dõi bán hàng realtime</span>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600 mt-1">Analytics và báo cáo chi tiết</span>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-600 mt-1">Tích hợp đa nền tảng</span>
                </div>
            </div>
        </div>
    );
};

export default BrandHeader; 