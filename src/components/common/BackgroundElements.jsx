import React from 'react';

const BackgroundElements = () => {
    return (
        <>
            {/* Background Gradients */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-200 to-green-200 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full blur-3xl"></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-10 right-10 w-4 h-4 bg-gradient-to-br from-blue-400 to-green-400 rounded-full animate-bounce opacity-60"></div>
            <div className="absolute bottom-20 left-10 w-3 h-3 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full animate-pulse opacity-40"></div>
            <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full animate-ping opacity-50"></div>
        </>
    );
};

export default BackgroundElements;