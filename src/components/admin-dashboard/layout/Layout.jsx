import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children, initialPage = 'dashboard' }) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const handleNavigation = (pageKey) => {
    console.log('📍 Navigating to:', pageKey);
    setCurrentPage(pageKey);
  };

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        {/* Sidebar */}
        <Sidebar currentPage={currentPage} onNavigate={handleNavigation} />

        {/* Layout Container */}
        <div className="layout-page">
          {/* Navbar */}
          <Navbar />

          {/* Content wrapper */}
          <div className="content-wrapper">
            {/* Content */}
            <div className="container-xxl flex-grow-1 container-p-y">
              {React.cloneElement(children, { currentPage, onNavigate: handleNavigation })}
            </div>

            {/* Footer */}
            <footer className="content-footer footer bg-footer-theme">
              <div className="container-xxl d-flex flex-wrap justify-content-between py-2 flex-md-row flex-column">
                <div className="mb-2 mb-md-0">
                  © {new Date().getFullYear()}, made with ❤️ by <strong>EVDMS Team</strong>
                </div>
                <div>
                  <a href="#" className="footer-link me-4">License</a>
                  <a href="#" className="footer-link me-4">Documentation</a>
                  <a href="#" className="footer-link">Support</a>
                </div>
              </div>
            </footer>

            <div className="content-backdrop fade" />
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div className="layout-overlay layout-menu-toggle" />
    </div>
  );
};

export default Layout;