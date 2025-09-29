import React from "react";

const NeumorphismButton = ({
    children,
    variant = 'default',
    size = 'default',
    className = '',
    disabled = false,
    ...props
}) => {
    const getVariantClasses = () => {
        switch (variant) {
            case 'social':
                return 'neu-social w-12 h-12 rounded-2xl flex items-center justify-center text-gray-600';
            case 'toggle':
                return 'neu-toggle w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors';
            case 'icon':
                return 'neu-icon p-4 rounded-2xl';
            default:
                return 'neu-button rounded-2xl font-semibold text-gray-700 relative';
        }
    };

    const getSizeClasses = () => {
        if (variant === 'social' || variant === 'toggle' || variant === 'icon') return '';
    
        switch (size) {
            case 'full':
                return 'w-full py-4';
            case 'large':
                return 'px-8 py-3';
            default:
                return 'px-6 py-2';
        }
    };

    return (
        <button
            className={`${getVariantClasses()} ${getSizeClasses()} ${className} ${disabled ? 'disabled:opacity-50 disabled:cursor-not-allowed' : ''}`}
            disabled={disabled}
            {...props}
        >
            <div className="relative z-10 flex items-center justify-center space-x-2">
                {children}
            </div>
        </button>
    );
};

export default NeumorphismButton;
