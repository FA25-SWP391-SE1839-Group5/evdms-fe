import React, { useState } from 'react';
import WelcomeCard from '../dashboard/WelcomeCard';
import CardProfit from '../dashboard/StatCard/CardProfit';
import CardSales from '../dashboard/StatCard/CardSales';
import CardPayment from '../dashboard/StatCard/CardPayment';
import CardTransactions from '../dashboard/StatCard/CardTransactionS';
import TotalRevenue from '../dashboard/TotalRevenue';
import ProfileReport from '../dashboard/ProfileReport';
import OrderStatistics from '../dashboard/OrderStatistics';
import ExpenseOverview from '../dashboard/ExpenseOverview';
import TransactionsList from '../dashboard/TransactionList';
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
                {/* Render children with currentPage prop */}
                {React.cloneElement(children, { currentPage, onNavigate: handleNavigate })}
              </div>

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