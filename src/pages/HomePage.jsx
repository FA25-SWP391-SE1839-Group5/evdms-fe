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
                        <li><button onClick={() => navigate('/catalog')} className="nav-link">EV CATALOG</button></li>
                        <li><a href="#" className="nav-link">DEALER PORTAL</a></li>
                        <li><a href="#" className="nav-link">SUPPORT</a></li>
                    </ul>
                    <div className="nav-actions">
                        <button className="btn-secondary" onClick={() => navigate('/login')}>Dealer Login</button>
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
                            <h2>Empower Your Dealership: Complete EV Sales & Inventory Management Platform.</h2>
                            <p>
                                Streamline your electric vehicle dealership with our comprehensive platform.
                                Manage inventory, track customer leads, process sales orders, generate reports,
                                and coordinate with manufacturers - all from one unified dashboard designed
                                specifically for EV dealers and staff.
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
                    <h2>Advanced Dealer Tools. Proven Results.</h2>
                    <div className="mobility-grid">
                        <div className="mobility-card">
                            <h3>Inventory. Sales. Analytics.</h3>
                            <p>
                                Real-time inventory tracking, automated sales pipeline management,
                                customer relationship tools, and detailed performance analytics.
                                Everything your dealership needs to excel in the EV market.
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
                            <h2>Dealership Management Reimagined.</h2>
                            <p>
                                Connect with manufacturers, manage multi-location inventories,
                                track customer financing, schedule service appointments, and
                                generate compliance reports - all integrated into one powerful
                                dealer management ecosystem.
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
                    <h2>Trusted by Leading EV Dealers Nationwide</h2>
                    <div className="reviews-grid">
                        <div className="review-card">
                            <div className="review-image">
                                <img src="/src/assets/images/car-4.jpg" alt="Dealer Showroom" />
                            </div>
                            <div className="review-content">
                                <h3>Streamlined Operations</h3>
                                <div className="review-stats">
                                    <div className="stat">
                                        <span className="number">300%</span>
                                        <span className="label">Sales Increase</span>
                                    </div>
                                    <div className="stat">
                                        <span className="number">45%</span>
                                        <span className="label">Time Saved</span>
                                    </div>
                                    <div className="stat">
                                        <span className="number">98%</span>
                                        <span className="label">Accuracy Rate</span>
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
                                    <h4>Complete Dealer Solution</h4>
                                    <p>Inventory tracking, sales pipeline, customer CRM, reporting dashboard.</p>
                                </div>
                            </div>
                        </div>
                        <div className="journey-image">
                            <div className="charging-card">
                                <h3>Dealer Success Made Simple</h3>
                                <p>Comprehensive tools, real-time insights, dedicated support</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="final-cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Become a Partner</h2>
                        <h3>Join Our Leading Dealer Network.</h3>
                        <p>Register now to become a dealer and grow your electric vehicle business with us</p>
                        <button className="btn-primary" onClick={() => navigate('/register')}>Register Now</button>
                    </div>
                    <div className="cta-image">
                        <img src="/src/assets/images/car-5.jpg" alt="Future Vehicle" />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <h4>Products</h4>
                            <ul>
                                <li><a href="#">Electric Vehicles</a></li>
                                <li><a href="#">Accessories</a></li>
                                <li><a href="#">Services</a></li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h4>Dealers</h4>
                            <ul>
                                <li><a href="#" onClick={() => navigate('/register')}>Become a Dealer</a></li>
                                <li><a href="#" onClick={() => navigate('/login')}>Login</a></li>
                                <li><a href="#">Support</a></li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h4>System</h4>
                            <ul>
                                <li><a href="#">Sales Management</a></li>
                                <li><a href="#">Reports</a></li>
                                <li><a href="#">Customers</a></li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h4>About Us</h4>
                            <ul>
                                <li><a href="#">Company</a></li>
                                <li><a href="#">Careers</a></li>
                                <li><a href="#">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2025 Electric Vehicle Dealer Management System. All rights reserved.</p>
                        <div className="social-links">
                            <a href="#">Facebook</a>
                            <a href="#">Twitter</a>
                            <a href="#">Instagram</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;