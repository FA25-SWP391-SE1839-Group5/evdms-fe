import React, { useState, useEffect } from 'react';
import DealerSidebar from './DealerSidebar';
import Navbar from '../../admin-dashboard/layout/Navbar'; // Assuming Navbar can be reused or adapted
import DealerManagerDashboard from '../../../pages/DealerManagerDashboard';
import DealerStaffDashboard from '../../../pages/DealerStaffDashboard';

const DealerLayout = ({ children, initialPage = 'dealer-dashboard' }) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Function passed to Sidebar and potentially children
  const handleNavigate = (page) => {
    console.log("DealerLayout: Navigating to", page);
    setCurrentPage(page);
    // Optionally update URL using history API if not using a router
    // window.history.pushState({}, '', `/${page}`);
  };

  // Sync state with browser back/forward (optional if not using URL updates)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace('/', '');
      // Check if path is a valid dealer page
      const validPages = ['dealer-dashboard', 'staff-dashboard', 'sales-orders', 'test-drives', 'feedbacks', 'dealer-staff', 'dealer-performance', 'dealer-orders'];
      if (validPages.includes(path)) {
        console.log("DealerLayout: PopState detected, setting page to", path);
        setCurrentPage(path);
      } else {
        // Default or handle unknown paths
        setCurrentPage(initialPage || 'dealer-dashboard');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [initialPage]);

   // Update URL when currentPage changes (optional)
   useEffect(() => {
     const path = `/${currentPage}`;
     if (window.location.pathname !== path) {
       console.log("DealerLayout: Pushing state to URL", path);
       window.history.pushState({}, '', path);
     }
   }, [currentPage]);

  // Render appropriate content based on currentPage
  const renderContent = () => {
    if (currentPage === 'staff-dashboard') {
      return <DealerStaffDashboard currentPage={currentPage} onNavigate={handleNavigate} />;
    }
    // For dealer-dashboard, dealer-staff, dealer-performance, dealer-orders
    // Check if children was provided (for backward compatibility)
    if (children) {
      return React.cloneElement(children, { currentPage, onNavigate: handleNavigate });
    }
    // Default: render DealerManagerDashboard
    return <DealerManagerDashboard currentPage={currentPage} onNavigate={handleNavigate} />;
  };

  return (
    <>
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          {/* Sidebar specific to Dealer */}
          <DealerSidebar currentPage={currentPage} onNavigate={handleNavigate} />

          <div className="layout-page">
            {/* Reusable or adapted Navbar */}
            <Navbar />

            <div className="content-wrapper">
              {/* Inject currentPage and navigation handler into the child component */}
              {renderContent()}

              <div className="content-backdrop fade" />
            </div>
            {/* Footer can be added here */}
          </div>
        </div>
        <div className="layout-overlay layout-menu-toggle" />
      </div>
    </>
  );
};

export default DealerLayout;
