import React from 'react';

const StatsSection = () => {
  const stats = [
    {
      value: '25',
      suffix: '+',
      label: 'Years of Experience',
      color: 'from-blue-500 to-blue-600',
    },
    {
      value: '10M',
      suffix: '+',
      label: 'Million Cars Sold',
      color: 'from-purple-500 to-purple-600',
    },
    {
      value: '100',
      suffix: '+',
      label: 'Dealership Locations',
      color: 'from-green-500 to-green-600',
    },
    {
      value: '99',
      suffix: '%',
      label: 'Customer Satisfaction',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center group cursor-pointer"
            >
              {/* Number with animated gradient */}
              <div className="mb-3">
                <span className={`text-5xl md:text-6xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 inline-block`}>
                  {stat.value}
                </span>
                <span className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.suffix}
                </span>
              </div>

              {/* Label */}
              <p className="text-gray-600 font-medium text-sm md:text-base">
                {stat.label}
              </p>

              {/* Decorative line */}
              <div className="mt-4 w-16 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 flex justify-center gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={`dot-${index}`}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-30"
              style={{
                animationDelay: `${index * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
