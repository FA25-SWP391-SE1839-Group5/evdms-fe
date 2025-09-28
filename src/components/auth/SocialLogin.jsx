import React from 'react';
import { Github, Twitter } from 'lucide-react';
import NeumorphismButton from '../ui/NeumorphismButton';

const SocialLogin = ({ onSocialLogin }) => {
    return (
        <>
            {/* Divider */}
            <div className="flex items-center justify-center space-x-4 my-8">
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
                <span className="text-gray-400 text-sm font-medium px-4 uppercase tracking-wider">
                    HOẶC TIẾP TỤC VỚI
                </span>
                <div className="h-px bg-gradient-to-l from-transparent via-gray-300 to-transparent flex-1"></div>
            </div>

            
        </>
    );
};