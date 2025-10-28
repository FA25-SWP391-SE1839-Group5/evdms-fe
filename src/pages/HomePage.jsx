import React from 'react';
import HeroSection from '../components/home/HeroSection';
import AboutSection from '../components/home/AboutSection';
import StatsSection from '../components/home/StatsSection';
import FeaturedVehicles from '../components/home/FeaturedVehicles';
import TestimonialsSection from '../components/home/TestimonialsSection';
import Footer from '../components/home/Footer';
import Navbar from '../components/home/Navbar';

const HomePage = ({ onNavigateToCatalog, onNavigateToLogin }) => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigateToCatalog={onNavigateToCatalog} onNavigateToLogin={onNavigateToLogin} />
      <HeroSection onNavigateToCatalog={onNavigateToCatalog} />
      <AboutSection />
      <StatsSection />
      <FeaturedVehicles onNavigateToCatalog={onNavigateToCatalog} />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default HomePage;
