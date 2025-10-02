import React from 'react';

const BackgroundElements = () => {
    return (
        <>
            {/* EV-themed Gradient Mesh - Green to Blue */}
            <div className="absolute inset-0 opacity-40">
                {/* Main EV gradient - Green to Blue */}
                <div
                    className="absolute top-0 left-0 w-full h-full"
                    style={{
                        background: 'radial-gradient(circle at 20% 30%, rgba(0, 200, 83, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(41, 98, 255, 0.3) 0%, transparent 50%)',
                        animation: 'gradientShift 15s ease-in-out infinite'
                    }}
                >    
                </div>
                {/* Secondary mesh layers */}
                <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-green-300 via-emerald-200 to-transparent rounded-full blur-3xl animate-pulse"></div>
                <div 
                    className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gradient-to-br from-blue-300 via-indigo-200 to-transparent rounded-full blur-3xl" 
                    style={{ 
                        animationDelay: '2s', animation: 'pulse 8s ease-in-out infinite' 
                    }}
                >
                </div>
                <div 
                    className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-teal-200 to-transparent rounded-full blur-2xl opacity-50" 
                    style={{ 
                        animationDelay: '4s', animation: 'pulse 10s ease-in-out infinite' 
                    }}
                >
                </div>
            </div>
        </>
    );
};

export default BackgroundElements;