import React from 'react';
import { Battery, Zap, Gauge, ArrowRight } from 'lucide-react';

const FeaturedVehicles = ({ onNavigateToCatalog }) => {
  const vehicles = [
    {
      id: 1,
      name: 'Model S Premium',
      tagline: 'Luxury Redefined',
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&auto=format&fit=crop',
      price: '$79,990',
      range: '405 miles',
      acceleration: '3.1s 0-60mph',
      power: '670 hp',
      color: 'from-blue-600 to-blue-700',
    },
    {
      id: 2,
      name: 'Urban Cruiser',
      tagline: 'City Smart',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&auto=format&fit=crop',
      price: '$45,990',
      range: '310 miles',
      acceleration: '5.3s 0-60mph',
      power: '450 hp',
      color: 'from-purple-600 to-purple-700',
    },
    {
      id: 3,
      name: 'Adventure SUV',
      tagline: 'Go Anywhere',
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&auto=format&fit=crop',
      price: '$65,990',
      range: '380 miles',
      acceleration: '4.2s 0-60mph',
      power: '580 hp',
      color: 'from-green-600 to-green-700',
    },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-blue-600 font-medium text-sm uppercase tracking-wider">
            • Our Vehicles
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">
            Featured Electric Vehicles
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our range of cutting-edge electric vehicles designed for performance, 
            comfort, and sustainability.
          </p>
        </div>

        {/* Vehicle Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Overlay Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-t ${vehicle.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-900">
                    New 2025
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title */}
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {vehicle.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{vehicle.tagline}</p>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                    <Battery size={20} className="text-blue-600 mb-1" />
                    <span className="text-xs text-gray-500">Range</span>
                    <span className="text-sm font-semibold text-gray-900">{vehicle.range}</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                    <Zap size={20} className="text-blue-600 mb-1" />
                    <span className="text-xs text-gray-500">0-60mph</span>
                    <span className="text-sm font-semibold text-gray-900">{vehicle.acceleration}</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                    <Gauge size={20} className="text-blue-600 mb-1" />
                    <span className="text-xs text-gray-500">Power</span>
                    <span className="text-sm font-semibold text-gray-900">{vehicle.power}</span>
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-500">Starting at</span>
                    <div className="text-2xl font-bold text-gray-900">{vehicle.price}</div>
                  </div>
                  <button 
                    onClick={onNavigateToCatalog}
                    className={`p-3 bg-gradient-to-r ${vehicle.color} text-white rounded-full hover:shadow-lg transition-all duration-300 group-hover:scale-110`}
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            onClick={onNavigateToCatalog}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all duration-300 hover:gap-4 shadow-lg hover:shadow-xl"
          >
            View All Vehicles
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedVehicles;
