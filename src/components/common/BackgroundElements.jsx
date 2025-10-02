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
            
            {/* EV Icon Illustration (Subtle) */}
            <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
                {/* Simple EV car silhouette using CSS */}
                <div className="absolute top-1/4 right-1/4 w-64 h-32 transform rotate-12">
                    <svg viewBox="0 0 200 100" className="w-full h-full">
                        {/* Car body */}
                        <path d="M 20 60 Q 20 40 40 40 L 60 40 L 70 20 L 130 20 L 140 40 L 160 40 Q 180 40 180 60 L 180 80 Q 180 85 175 85 L 165 85 Q 165 95 155 95 Q 145 95 145 85 L 55 85 Q 55 95 45 95 Q 35 95 35 85 L 25 85 Q 20 85 20 80 Z" fill="currentColor" />
                        {/* Wheels */}
                        <circle cx="50" cy="85" r="12" fill="currentColor" />
                        <circle cx="150" cy="85" r="12" fill="currentColor" />
                        {/* Lightning bolt (EV symbol) */}
                        <path d="M 100 35 L 95 50 L 105 50 L 100 65 L 108 50 L 98 50 Z" fill="#00C853" opacity="0.6" />
                    </svg>
                </div>
            </div>


            
        </>
    );
};

export default BackgroundElements;