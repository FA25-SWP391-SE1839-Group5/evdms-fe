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

            </div>
        </>
    );
};

export default BackgroundElements;