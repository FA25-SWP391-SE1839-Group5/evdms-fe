import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="home-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <img src="/src/assets/logo1.png" alt="Logo" className="logo" />
          </div>
          <ul className="nav-menu">
            <li><a href="/" className="nav-link active">HOME</a></li>
            <li><button onClick={() => navigate('/catalog')} className="nav-link">VEHICLES</button></li>
            <li><a href="#" className="nav-link">SERVICES</a></li>
            <li><a href="#" className="nav-link">ABOUT</a></li>
          </ul>
          <div className="nav-actions">
            <button className="btn-secondary">Sign In</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Electric Vehicle<br />
              <span className="gradient-text">Dealer Management System</span>
            </h1>
            <p className="hero-subtitle">
              Comprehensive solution for managing electric vehicle sales through dealer networks. 
              Optimize sales processes, customer management, and revenue reporting efficiently.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => navigate('/login')}>Login to System</button>
              <button className="btn-outline" onClick={() => navigate('/register')}>Become a Dealer</button>
            </div>
          </div>
          <div className="hero-image">
            <img src="/src/assets/images/car-1.jpg" alt="Electric Vehicle" />
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Partner Dealers</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">15K+</span>
            <span className="stat-label">Vehicles Sold</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">EV Models</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">99%</span>
            <span className="stat-label">Customer Satisfaction</span>
          </div>
        </div>
      </section>

     