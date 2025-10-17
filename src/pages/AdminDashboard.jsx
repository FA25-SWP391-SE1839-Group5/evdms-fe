import React from 'react';
import WelcomeCard from '../components/admin-dashboard/dashboard/WelcomeCard';
import CardProfit from '../components/admin-dashboard/dashboard/StatCard/CardProfit';
import CardSales from '../components/admin-dashboard/dashboard/StatCard/CardSales';
import CardPayment from '../components/admin-dashboard/dashboard/StatCard/CardPayment';
import CardTransactions from '../components/admin-dashboard/dashboard/StatCard/CardTransactionS';
import TotalRevenue from '../components/admin-dashboard/dashboard/TotalRevenue';
import ProfileReport from '../components/admin-dashboard/dashboard/ProfileReport';
import OrderStatistics from '../components/admin-dashboard/dashboard/OrderStatistics';
import ExpenseOverview from '../components/admin-dashboard/dashboard/ExpenseOverview';
import TransactionsList from '../components/admin-dashboard/dashboard/TransactionList';
import UserManagement from '../components/admin-dashboard/users/UserManagement';

const AdminDashboard = ({ currentPage = 'dashboard' }) => {
  const renderPageContent = () => {
    switch (currentPage) {
      case 'users':
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <UserManagement />
          </div>
        );
      
      case 'dealers':
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <h4 className="fw-bold py-3 mb-4">Dealers Management</h4>
            <div className="card">
              <div className="card-body">
                <p>Dealers management page - Coming soon...</p>
              </div>
            </div>
          </div>
        );
      
      case 'customers':
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <h4 className="fw-bold py-3 mb-4">Customers Management</h4>
            <div className="card">
              <div className="card-body">
                <p>Customers management page - Coming soon...</p>
              </div>
            </div>
          </div>
        );
      
      case 'inventory':
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <h4 className="fw-bold py-3 mb-4">Vehicle Inventory</h4>
            <div className="card">
              <div className="card-body">
                <p>Vehicle inventory page - Coming soon...</p>
              </div>
            </div>
          </div>
        );
      
      case 'quotations':
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <h4 className="fw-bold py-3 mb-4">Quotations</h4>
            <div className="card">
              <div className="card-body">
                <p>Quotations page - Coming soon...</p>
              </div>
            </div>
          </div>
        );
      
      case 'orders':
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <h4 className="fw-bold py-3 mb-4">Sales Orders</h4>
            <div className="card">
              <div className="card-body">
                <p>Sales orders page - Coming soon...</p>
              </div>
            </div>
          </div>
        );
      
      case 'testdrives':
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <h4 className="fw-bold py-3 mb-4">Test Drives</h4>
            <div className="card">
              <div className="card-body">
                <p>Test drives page - Coming soon...</p>
              </div>
            </div>
          </div>
        );
      
      case 'payments':
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <h4 className="fw-bold py-3 mb-4">Payments</h4>
            <div className="card">
              <div className="card-body">
                <p>Payments page - Coming soon...</p>
              </div>
            </div>
          </div>
        );
      
      case 'promotions':
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <h4 className="fw-bold py-3 mb-4">Promotions</h4>
            <div className="card">
              <div className="card-body">
                <p>Promotions page - Coming soon...</p>
              </div>
            </div>
          </div>
        );
      
      case 'audit':
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <h4 className="fw-bold py-3 mb-4">Audit Logs</h4>
            <div className="card">
              <div className="card-body">
                <p>Audit logs page - Coming soon...</p>
              </div>
            </div>
          </div>
        );
      
      case 'feedback':
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <h4 className="fw-bold py-3 mb-4">Feedback</h4>
            <div className="card">
              <div className="card-body">
                <p>Feedback page - Coming soon...</p>
              </div>
            </div>
          </div>
        );
      
      case 'dashboard':
      default:
        return (
          <>
      {/* Layout wrapper */}
          
            {/* Content wrapper */}
              {/* Content */}
              <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row">
                  <div className="col-lg-8 mb-4 order-0">
                    <WelcomeCard />
                  </div>
                  <div className="col-lg-4 col-md-4 order-1">
                    <div className="row">
                      {/* Profit */}
                      <div className="col-lg-6 col-md-12 col-6 mb-4">
                        <CardProfit />
                      </div>

                      {/* Sales */}
                      <div className="col-lg-6 col-md-12 col-6 mb-4">
                        <CardSales />
                      </div>
                    </div>
                  </div>
                  
                  {/* Total Revenue */}
                  <div className="col-12 col-lg-8 order-2 order-md-3 order-lg-2 mb-4">
                    <TotalRevenue />
                  </div>

                  {/*/ Total Revenue */}
                  <div className="col-12 col-md-8 col-lg-4 order-3 order-md-2">
                    <div className="row">
                      {/* Payment */}
                      <div className="col-6 mb-4">
                        <CardPayment />
                      </div>

                      {/* Transaction */}
                      <div className="col-6 mb-4">
                        <CardTransactions />
                      </div>

                      {/* Profile Report */}
                      <div className="col-12 mb-4">
                        <ProfileReport />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  {/* Order Statistics */}
                  <div className="col-md-6 col-lg-4 col-xl-4 order-0 mb-4">
                    <OrderStatistics />
                  </div>

                  {/* Expense Overview */}
                  <div className="col-md-6 col-lg-4 order-1 mb-4">
                    <ExpenseOverview />
                  </div>
                
                  {/* Transactions */}
                  <div className="col-md-6 col-lg-4 order-2 mb-4">
                    <TransactionsList />
                  </div>
                </div>
              </div>
    
        
        <div className="layout-overlay layout-menu-toggle" />
    </>
        );
    }
  };

  return renderPageContent();
};

export default AdminDashboard;