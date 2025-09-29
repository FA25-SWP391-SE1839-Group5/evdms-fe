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

            {/* Social Login Buttons */}
            <div className="flex justify-center space-x-4 mb-8">
                <NeumorphismButton 
                    variant="social"
                    onClick={() => onSocialLogin('Google')}
                >
                    <div className="w-5 h-5 bg-gradient-to-r from-red-500 to-orange-500 rounded flex items-center justify-center text-white font-bold text-xs">
                        G
                    </div>
                </NeumorphismButton>
        
                <NeumorphismButton 
                    variant="social"
                    onClick={() => onSocialLogin('GitHub')}
                >
                    <Github className="w-5 h-5" />
                </NeumorphismButton>
        
                <NeumorphismButton 
                    variant="social"
                    onClick={() => onSocialLogin('Twitter')}
                >
                    <Twitter className="w-5 h-5 text-blue-500" />
                </NeumorphismButton>
            </div>
        </>
    );
};

export default SocialLogin;