import React, { useState, useEffect } from 'react';
import EVMSidebar from './EVMSidebar';
import EVMNavbar from './EVMNavbar';

const EVMLayout = ({ children, initialPage = 'evm-dashboard' }) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    // Update URL without page reload
    window.history.pushState({}, '', `/${page}`);
  };

  // Sync with browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace('/', '');
      if (path) {
        setCurrentPage(path);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <>
      {/* Layout wrapper */}
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          {/* Sidebar */}
          <EVMSidebar currentPage={currentPage} onNavigate={handleNavigate} />
      
          {/* Layout page */}
          <div className="layout-page">
            {/* Navbar */}
            <EVMNavbar />
          
            {/* Content wrapper */}
            <div className="content-wrapper">
              {/* Content */}
              {React.cloneElement(children, { currentPage, onNavigate: handleNavigate })}

              {/* Footer */}
              <div className="content-backdrop fade" />
            </div>
          </div>
        </div>
        <div className="layout-overlay layout-menu-toggle" />
      </div>
    </>
  );
};

export default EVMLayout;
