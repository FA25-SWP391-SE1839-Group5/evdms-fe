import React, { Children, useEffect, useRef } from "react";

const NeumorphismCard = ({ children, className = '', onMouseMove = true }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        if (!onMouseMove) return;

        const handleMouseMove = (e) => {
            if (cardRef.current) {
                const card = cardRef.current;
                const rect = card.getBouncingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const angleX = (x - centerX) / centerX;
                const angleY = (y - centerY) / centerY;

                const shadowX = angleX * 10;
                const shadowY = angleY * 10;

                card.style.boxShadow = `
                    ${20 + shadowX}px ${20 + shadowY}px 60px #bec3cf,
                    ${-20 - shadowX}px ${-20 - shadowY}px 60px #ffffff
                `;
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, [onMouseMove]);

    
};