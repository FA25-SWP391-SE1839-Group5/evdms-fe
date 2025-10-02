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

            {/* Innovation Section */}
            <section className="innovation-section">
                <div className="container">
                    <div className="innovation-content">
                        <div className="innovation-text">
                            <h2>Comprehensive Management System: Optimize Dealer Operations and Enhance Business Efficiency.</h2>
                            <p>
                                We provide modern electric vehicle dealer management solutions
                                that optimize sales processes, customer management, and revenue reporting.
                                Our system is designed to enhance business efficiency and deliver
                                the best experience for both dealers and customers.
                            </p>
                            <button className="btn-primary">Learn More</button>
                        </div>
                        <div className="innovation-image">
                            <img src="/src/assets/images/bg_1.jpg" alt="Innovation" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Vehicle Section - XEV 9e */}
            <section className="featured-vehicle-section">
                <div className="container">
                    <div className="featured-content">
                        <div className="featured-info">
                            <h2>Featured Product: VinFast VF 9</h2>
                            <h3 className="vehicle-name">VF 9<br /><span className="subtitle">Luxury Class</span></h3>
                            <div className="vehicle-specs">
                                <div className="spec-item">
                                    <span className="spec-label">Range</span>
                                    <span className="spec-value">450km</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Top Speed</span>
                                    <span className="spec-value">200 km/h</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Charging Time</span>
                                    <span className="spec-value">35 minutes</span>
                                </div>
                            </div>
                            <button className="btn-primary">Explore Now</button>
                        </div>
                        <div className="featured-image">
                            <img src="/src/assets/images/car-2.jpg" alt="XEV 9e" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Smart Mobility Section */}
            <section className="smart-mobility-section">
                <div className="container">
                    <h2>Smart Management. Efficient Business.</h2>
                    <div className="mobility-grid">
                        <div className="mobility-card">
                            <h3>Simple. Efficient. Comprehensive.</h3>
                            <p>
                                Our dealer management system combines modern technology
                                with user-friendly interfaces to create comprehensive management solutions
                                that optimize business operations and increase sales performance.
                            </p>
                            <button className="btn-outline">Learn More</button>
                        </div>
                        <div className="mobility-image">
                            <img src="/src/assets/images/car-3.jpg" alt="Smart Mobility" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Home Future Section */}
            <section className="home-future-section">
                <div className="container">
                    <div className="future-content">
                        <div className="future-text">
                            <h2>The Future of EV Business, Today.</h2>
                            <p>
                                Integrate your dealership seamlessly with our advanced management
                                system. Control inventory, monitor sales performance, and optimize
                                your business operations all from one intelligent platform.
                            </p>
                            <button className="btn-primary">Learn More</button>
                        </div>
                        <div className="future-image">
                            <img src="/src/assets/images/bg_2.jpg" alt="Smart Home Integration" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Customer Reviews Section */}
            <section className="customer-reviews-section">
                <div className="container">
                    <h2>Loved by Customers, Built for the Future</h2>
                    <div className="reviews-grid">
                        <div className="review-card">
                            <div className="review-image">
                                <img src="/src/assets/images/car-4.jpg" alt="Customer Vehicle" />
                            </div>
                            <div className="review-content">
                                <h3>Built For Any Planet</h3>
                                <div className="review-stats">
                                    <div className="stat">
                                        <span className="number">11,000</span>
                                        <span className="label">Miles Driven</span>
                                    </div>
                                    <div className="stat">
                                        <span className="number">300</span>
                                        <span className="label">Charging Sessions</span>
                                    </div>
                                    <div className="stat">
                                        <span className="number">2.5</span>
                                        <span className="label">Years Owned</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Journey Section */}
            <section className="journey-section">
                <div className="container">
                    <div className="journey-content">
                        <div className="journey-text">
                            <h2>Your Journey to Business Success</h2>
                            <p>
                                From dealer registration, inventory management, customer care
                                to sales reporting - we support the entire business process
                                so you can focus on growth and market expansion.
                            </p>
                            <div className="journey-features">
                                <div className="feature">
                                    <h4>Efficient Management</h4>
                                    <p>Easy. Fast. Accurate. Optimize every operation.</p>
                                </div>
                            </div>
                        </div>
                        <div className="journey-image">
                            <div className="charging-card">
                                <h3>Charging Made Simple</h3>
                                <p>Fast, convenient, and accessible charging network</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

   