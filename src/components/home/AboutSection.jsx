import React from 'react';
import { ArrowRight } from 'lucide-react';

const AboutSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="mb-6">
              <span className="text-blue-600 font-medium text-sm uppercase tracking-wider">
                • Who we are
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Empowering Innovation Through Collaboration:{' '}
              <span className="text-gray-600">
                Discover Our Passion for Excellence and Commitment
              </span>{' '}
              <span className="text-blue-600">to Transformative Solutions.</span>
            </h2>

            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              With a diverse range of dealerships dedicated to providing exceptional 
              vehicles and unparalleled customer care, we strive to make your automotive 
              experience seamless and enjoyable across all our locations.
            </p>

            <button className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-4 transition-all duration-300">
              Learn More
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Right Content - Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Large Image */}
              <div className="col-span-1 row-span-2">
                <img
                  src="https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=500&auto=format&fit=crop"
                  alt="Electric Vehicle Interior"
                  className="w-full h-full object-cover rounded-2xl shadow-lg"
                />
              </div>
              
              {/* Small Image */}
              <div className="col-span-1">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&auto=format&fit=crop"
                  alt="Modern Showroom"
                  className="w-full h-full object-cover rounded-2xl shadow-lg"
                />
              </div>

              {/* Empty space for design */}
              <div className="col-span-1 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl" />
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center transform rotate-12">
                  <span className="text-white font-bold text-2xl transform -rotate-12">F</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">Foresight</div>
                  <div className="text-sm text-gray-500">Electric Vehicles</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
