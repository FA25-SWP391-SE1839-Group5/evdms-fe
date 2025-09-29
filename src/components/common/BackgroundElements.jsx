import React from 'react';

const BackgroundElements = () => {
    return (
        <>
            {/* Background Gradients */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-200 to-green-200 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full blur-3xl"></div>
            </div>

           
        </>
    );
};

export default BackgroundElements;