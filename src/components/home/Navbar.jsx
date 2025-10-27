import React, { useState } from 'react';
import { Phone } from 'lucide-react';

const Navbar = ({ onNavigateToCatalog, onNavigateToLogin }) => {
  const [activeLink, setActiveLink] = useState('home');

  const navLinks = [
    { id: 'home', label: 'Home', action: null },
    { id: 'products', label: 'Products', action: onNavigateToCatalog },
    { id: 'solutions', label: 'Solutions', action: null },
    { id: 'lineup', label: 'Line Up', action: onNavigateToCatalog },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center transform rotate-12">
              <span className="text-white font-bold text-2xl transform -rotate-12">F</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveLink(link.id);
                  if (link.action) link.action();
                }}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeLink === link.id
                    ? 'bg-gray-100 text-blue-600 font-medium'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onNavigateToLogin}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-600/30"
            >
              Get Started
            </button>
            <button className="p-2.5 rounded-lg bg-gray-100 text-blue-600 hover:bg-blue-50 transition-all duration-300">
              <Phone size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
