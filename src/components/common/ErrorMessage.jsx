import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message }) => {
    if (!message) return null;

    return (
        <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-xl border-l-4 border-red-500">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm font-medium">{message}</p>
        </div>
    );
};

export default ErrorMessage;