import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children, initialPage  = 'dashboard' }) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      {/* Layout wrapper */}
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          {/* Sidebar */}
          <Sidebar currentPage={currentPage} onNavigate={handleNavigate}/>
      
          {/* Layout page */}
          <div className="layout-page">
            {/* Navbar */}
            <Navbar />
          
            {/* Content wrapper */}
            <div className="content-wrapper">
              {/* Content */}
                {/* Render children with currentPage prop */}
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

export default Layout;