import React from 'react';

// Import the specific page components you will create
import StaffManagement from '../components/dealer-mananger-dashboard/staff-management/StaffManagement';
import StaffPerformancePage from '../components/dealer-mananger-dashboard/staff-performance/StaffPerformancePage';
// import DealerOrdersPage from '../components/dealer-manager-dashboard/orders/DealerOrdersPage';

// Placeholder components for now
const DealerOrdersPage = () => <div className="card"><div className="card-body">Dealer Orders - Coming Soon...</div></div>;


const DealerManagerDashboard = ({ currentPage }) => {

  // Simple Dashboard Overview (Can be expanded later)
  const renderDashboardOverview = () => (
    <div className="row">
      <div className="col-12">
          <div className="card mb-4">
              <div className="card-body">
                   <h4 className="mb-1">Welcome, Dealer Manager!</h4>
                   <p className="mb-0 text-muted">Manage your staff, orders, and performance.</p>
                   {/* Add quick stats or links here */}
              </div>
          </div>
           {/* Maybe add some quick stat cards here */}
      </div>
    </div>
  );

  // Render content based on the currentPage prop from DealerLayout
  const renderContent = () => {
    console.log("DealerManagerDashboard: Rendering content for page:", currentPage);
    switch (currentPage) {
      case 'dealer-staff':
        return <StaffManagement />;
      case 'dealer-performance':
        return <StaffPerformancePage />;
      case 'dealer-orders':
        return <DealerOrdersPage />;
      case 'dealer-dashboard':
      default:
        return renderDashboardOverview(); // Default to overview
    }
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      {renderContent()}
    </div>
  );
};

export default DealerManagerDashboard;
