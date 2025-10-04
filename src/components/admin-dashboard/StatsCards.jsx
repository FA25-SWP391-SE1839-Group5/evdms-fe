import React from 'react';
import { ChevronRight, User, Car, ShoppingBag } from 'lucide-react';

const StatsCards = ({ stats, loading }) => {
  const statsData = [
    {
      label: 'Total Dealers',
      value: stats.dealers,
      icon: ChevronRight,
      color: 'text-green-600',
      badge: 'Active'
    },
    {
      label: 'Total Customers',
      value: stats.customers,
      icon: User,
      color: 'text-blue-600',
      badge: 'Registered'
    },
    {
      label: 'Total Vehicles',
      value: stats.vehicles,
      icon: Car,
      color: 'text-yellow-600',
      badge: 'In Stock'
    },
    {
      label: 'Total Orders',
      value: stats.orders,
      icon: ShoppingBag,
      color: 'text-red-600',
      badge: 'This Month'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-gray-500 text-sm mb-2">{stat.label}</div>
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {loading ? '...' : stat.value}
            </div>
            <div className={`text-sm ${stat.color} flex items-center justify-center gap-1`}>
              <Icon size={16} />
              <span>{stat.badge}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;