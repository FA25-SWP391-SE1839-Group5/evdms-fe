import React from 'react';
import { Menu, Search, LogOut } from 'lucide-react';

const Navbar = ({ user, onToggleSidebar, onLogout }) => {
  return (
    <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleSidebar} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-80 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="font-semibold">{user?.name || 'Admin User'}</div>
            <div className="text-sm text-gray-500">
              {user?.role === 'admin' ? 'System Administrator' : 
               user?.role === 'dealer_manager' ? 'Dealer Manager' :
               user?.role === 'dealer_staff' ? 'Dealer Staff' :
               user?.role === 'evm_staff' ? 'EVM Staff' : 'User'}
            </div>
          </div>
          
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          
          <button
            onClick={onLogout}
            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;