import React from 'react';
import UserManagement from '../components/admin-dashboard/users/UserManagement';

const AdminDashboard = ({ currentPage = 'dashboard' }) => {
  const renderPageContent = () => {
    switch (currentPage) {
      case 'users':
        return <UserManagement />;
      
      case 'dealers':
        return (
          <>
            <h4 className="fw-bold py-3 mb-4">Dealers Management</h4>
            <div className="card">
              <div className="card-body">
                <p>Dealers management page - Coming soon...</p>
              </div>
            </div>
          </>
        );
      
      case 'customers':
        return (
          <>
            <h4 className="fw-bold py-3 mb-4">Customers Management</h4>
            <div className="card">
              <div className="card-body">
                <p>Customers management page - Coming soon...</p>
              </div>
            </div>
          </>
        );
      
      case 'inventory':
        return (
          <>
            <h4 className="fw-bold py-3 mb-4">Vehicle Inventory</h4>
            <div className="card">
              <div className="card-body">
                <p>Vehicle inventory page - Coming soon...</p>
              </div>
            </div>
          </>
        );
      
      case 'quotations':
        return (
          <>
            <h4 className="fw-bold py-3 mb-4">Quotations</h4>
            <div className="card">
              <div className="card-body">
                <p>Quotations page - Coming soon...</p>
              </div>
            </div>
          </>
        );
      
      case 'orders':
        return (
          <>
            <h4 className="fw-bold py-3 mb-4">Sales Orders</h4>
            <div className="card">
              <div className="card-body">
                <p>Sales orders page - Coming soon...</p>
              </div>
            </div>
          </>
        );
      
      case 'testdrives':
        return (
          <>
            <h4 className="fw-bold py-3 mb-4">Test Drives</h4>
            <div className="card">
              <div className="card-body">
                <p>Test drives page - Coming soon...</p>
              </div>
            </div>
          </>
        );
      
      case 'payments':
        return (
          <>
            <h4 className="fw-bold py-3 mb-4">Payments</h4>
            <div className="card">
              <div className="card-body">
                <p>Payments page - Coming soon...</p>
              </div>
            </div>
          </>
        );
      
      case 'promotions':
        return (
          <>
            <h4 className="fw-bold py-3 mb-4">Promotions</h4>
            <div className="card">
              <div className="card-body">
                <p>Promotions page - Coming soon...</p>
              </div>
            </div>
          </>
        );
      
      case 'audit':
        return (
          <>
            <h4 className="fw-bold py-3 mb-4">Audit Logs</h4>
            <div className="card">
              <div className="card-body">
                <p>Audit logs page - Coming soon...</p>
              </div>
            </div>
          </>
        );
      
      case 'feedback':
        return (
          <>
            <h4 className="fw-bold py-3 mb-4">Feedback</h4>
            <div className="card">
              <div className="card-body">
                <p>Feedback page - Coming soon...</p>
              </div>
            </div>
          </>
        );
      
      default:
        return;
    }
  };

  return renderPageContent();
};

export default AdminDashboard;