import React from 'react';
import { 
  Home, 
  Store, 
  User, 
  Car, 
  FileText, 
  ShoppingBag, 
  Calendar, 
  CreditCard, 
  Gift, 
  Users, 
  History, 
  MessageSquare 
} from 'lucide-react';

const Sidebar = ({ isOpen, activeSection, onSectionChange }) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', key: 'dashboard' },
    { header: 'Management' },
    { icon: Store, label: 'Dealers', key: 'dealers' },
    { icon: User, label: 'Customers', key: 'customers' },
    { icon: Car, label: 'Vehicle Inventory', key: 'inventory' },
    { icon: FileText, label: 'Quotations', key: 'quotations' },
    { icon: ShoppingBag, label: 'Sales Orders', key: 'orders' },
    { icon: Calendar, label: 'Test Drives', key: 'testdrives' },
    { icon: CreditCard, label: 'Payments', key: 'payments' },
    { icon: Gift, label: 'Promotions', key: 'promotions' },
    { header: 'System' },
    { icon: Users, label: 'Users', key: 'users' },
    { icon: History, label: 'Audit Logs', key: 'audit' },
    { icon: MessageSquare, label: 'Feedback', key: 'feedback' }
  ];

  if (!isOpen) return null;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 fixed h-screen overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img
            src="src/assets/images/elecar_logo.svg"   // 👉 thay đường dẫn này bằng ảnh của bạn
            alt="Logo"
            className="w-10 h-16 rounded-lg object-cover"
          />
          <span className="text-xl font-bold text-indigo-600">EVDMS</span>
        </div>
      </div>
      
      <nav className="p-4">
        {menuItems.map((item, index) => {
          if (item.header) {
            return (
              <div key={index} className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase mt-4">
                {item.header}
              </div>
            );
          }
          
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => onSectionChange(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeSection === item.key
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;