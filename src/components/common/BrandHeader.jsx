import React from 'react';
import { Zap } from 'lucide-react';
import NeumorphismButton from '../ui/NeumorphismButton';

const BrandHeader = () => {
    return (
        <div className="text-center mb-8">
            <NeumorphismButton variant="icon" className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 rounded-xl flex items-center justify-center">
                    <Zap className="w-7 h-7 text-white" />
                </div>
            </NeumorphismButton>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent mb-2">
                Elecar Dealer 
            </h1>
            <p className="text-gray-500 text-sm">Hệ thống quản lý đại lý xe điện</p>
        </div>
    );
};

export default BrandHeader;