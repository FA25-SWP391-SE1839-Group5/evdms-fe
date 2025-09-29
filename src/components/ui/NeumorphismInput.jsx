import { Icon } from "lucide-react";
import React, { forwardRef } from "react";

const NeumorphismInput = forwardRef (({
    icon: Icon,
    error,
    children,
    className = '',
    ...props
}, ref) => {
    return (
        <div>
            <div
                ref={ref}
                className={`neu-input rounded-2xl p-4 transition-all duration-300 ${error ? 'error' : ''} ${className}`}
            >
                <div className="flex items-center space-x-3">
                    {Icon && <Icon className="w-5 h-5 text-gray-500" />}
                    {children}
                </div>
            </div>
            {error && (
                <div className="text-red-500 text-xs mt-2 ml-5 font-medium opacity-100 transform translate-y-0 transition-all duration-300">
                    {error}
                </div>
            )}
        </div>
    );
});

NeumorphismInput.displayName = 'NeumorphismInput';

export default NeumorphismInput