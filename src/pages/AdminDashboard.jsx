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
import DealerManagement from '../components/admin-dashboard/dealers/dealer-list/DealerManagement';
import DealerContractManagement from '../components/admin-dashboard/dealers/dealer-contract/DealerContractManagement';
import DealerOrderManagement from '../components/admin-dashboard/dealers/dealer-order/DealerOrderManagement';
import DealerPaymentManagement from '../components/admin-dashboard/dealers/dealer-payment/DealerPaymentManagement';
import RolesPermissionsTab from '../components/admin-dashboard/users/RolesPermissionsTab';
import VehicleInventoryManagement from '../components/admin-dashboard/vehicle/VehicleInventoryManagement';
import AuditLogManagement from '../components/admin-dashboard/audit/AuditLogManagement';
import PromotionManagement from '../components/admin-dashboard/promotions/PromotionManagement';
import SalesOrderManagement from '../components/admin-dashboard/sales-orders/SalesOrderManagement';
import QuotationManagement from '../components/admin-dashboard/quotation/QuotationManagement';
import CustomerManagement from '../components/admin-dashboard/customers/CustomerManagement';
import FeedbackManagement from '../components/admin-dashboard/feedback/FeedbackManagement';
import TestDriveManagement from '../components/admin-dashboard/test-drives/TestDriveManagement';
import PaymentManagement from '../components/admin-dashboard/payments/PaymentManagement';

const AdminDashboard = ({ currentPage = 'dashboard' }) => {
  const renderPageContent = () => {
    switch (currentPage) {
      case 'users':
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <UserManagement />
          </div>
        );
      
      case 'roles':
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <RolesPermissionsTab />
          </div>
        );

      case 'dealers':
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <DealerManagement />
          </div>
        );
      
      case 'dealer-contracts':
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <DealerContractManagement />
          </div>
        );

      case 'dealer-orders':
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <DealerOrderManagement />
          </div>
        );

      case 'dealer-payments':
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <DealerPaymentManagement />
          </div>
        );

      case 'customers':
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <CustomerManagement />
          </div>
        );
      
      case 'inventory':
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <VehicleInventoryManagement />
          </div>
        );
      
      case 'quotations':
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <QuotationManagement />
          </div>
        );
      
      case 'orders':
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <SalesOrderManagement />
          </div>
        );
      
      case 'testdrives':
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <TestDriveManagement />
          </div>
        );
      
      case 'payments':
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <PaymentManagement />
          </div>
        );
      
      case 'promotions':
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <PromotionManagement />
          </div>
        );
      
      case 'audit':
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <AuditLogManagement />
          </div>
        );
      
      case 'feedback':
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <FeedbackManagement />
          </div>
        );
      
      case 'dashboard':
      default:
        return (
          <>
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
        </>
      );
    }
  };

  return renderPageContent();
};

export default AdminDashboard;