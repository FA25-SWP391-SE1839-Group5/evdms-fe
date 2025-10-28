import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroSection = ({ onNavigateToCatalog }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      id: 1,
      badge: '#No1 EV Dealership in the US',
      title: 'Drive the Future with Future Electric Mobility.',
      subtitle: 'Embrace the future of driving with our innovative electric vehicles.',
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=300&auto=format&fit=crop',
    },
    {
      id: 2,
      badge: 'Sustainable Transportation',
      title: 'Experience Zero Emission Driving Today.',
      subtitle: 'Join the electric revolution with cutting-edge technology.',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=300&auto=format&fit=crop',
    },
    {
      id: 3,
      badge: 'Advanced Technology',
      title: 'Smart Features for Modern Lifestyle.',
      subtitle: 'Discover intelligent driving with next-gen EVs.',
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200&auto=format&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=300&auto=format&fit=crop',
    },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="relative mt-20 mx-6 mb-12">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl">
          {/* Main Slide Content */}
          <div className="relative h-[600px]">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {/* Background Image */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-2xl ml-16 text-white">
                    {/* Badge */}
                    <div className="inline-block mb-6">
                      <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium">
                        {slide.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                      {slide.title}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl text-gray-200 mb-8">
                      {slide.subtitle}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex gap-4">
                      <button
                        onClick={onNavigateToCatalog}
                        className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-600/50"
                      >
                        Where to Buy
                      </button>
                      <button
                        onClick={onNavigateToCatalog}
                        className="px-8 py-3 bg-white/10 backdrop-blur-md text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-300 border border-white/30"
                      >
                        See Details
                      </button>
                    </div>

                    {/* Thumbnail Preview */}
                    <div className="mt-12">
                      <img
                        src={slide.thumbnail}
                        alt="Vehicle preview"
                        className="w-48 h-32 object-cover rounded-lg shadow-xl border-2 border-white/30"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
          >
            <ChevronRight size={24} />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 right-8 flex flex-col gap-3">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(index)}
                className="group flex items-center"
              >
                <div
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'w-16 bg-white'
                      : 'w-8 bg-white/40 group-hover:bg-white/60'
                  }`}
                />
                <span className="ml-3 text-white text-sm font-medium">
                  0{index + 1}
                </span>
              </button>
            ))}
          </div>

          {/* Brand Badge */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center transform rotate-12">
                <span className="text-white font-bold text-lg transform -rotate-12">F</span>
              </div>
              <span className="text-gray-800 font-semibold">Foresight</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
