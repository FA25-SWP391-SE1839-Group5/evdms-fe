import React from 'react';
import WelcomeCard from '../dashboard/WelcomeCard';
import StatCard from '../dashboard/StatCard/StatCard';
import TotalRevenue from '../dashboard/TotalRevenue';
import ProfileReport from '../dashboard/ProfileReport';
import OrderStatistics from '../dashboard/OrderStatistics';
import ExpenseOverview from '../dashboard/ExpenseOverview';
import TransactionsList from '../dashboard/TransactionList';

const DashboardPage = () => {
  const statCards = [
    {
      title: 'Profit',
      value: '$12,628',
      percentage: '+72.80%',
      isPositive: true,
      icon: '../assets/img/icons/unicons/chart-success.png'
    },
    {
      title: 'Sales',
      value: '$4,679',
      percentage: '+28.42%',
      isPositive: true,
      icon: '../assets/img/icons/unicons/wallet-info.png'
    }
  ];

  const bottomStatCards = [
    {
      title: 'Payments',
      value: '$2,456',
      percentage: '-14.82%',
      isPositive: false,
      icon: '../assets/img/icons/unicons/paypal.png',
      colClass: 'col-6 mb-4'
    },
    {
      title: 'Transactions',
      value: '$14,857',
      percentage: '+28.14%',
      isPositive: true,
      icon: '../assets/img/icons/unicons/cc-primary.png',
      colClass: 'col-6 mb-4'
    }
  ];

  return (
    <>
      <div className="row">
        {/* Welcome Card */}
        <WelcomeCard userName="John" percentage={72} />
        
        {/* Top Stat Cards */}
        <div className="col-lg-4 col-md-4 order-1">
          <div className="row">
            {statCards.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </div>
      </div>

      <div className="row">
        {/* Total Revenue */}
        <TotalRevenue />

        {/* Bottom Stat Cards + Profile Report */}
        <div className="col-12 col-md-8 col-lg-4 order-3 order-md-2">
          <div className="row">
            {bottomStatCards.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
            <ProfileReport />
          </div>
        </div>
      </div>

      <div className="row">
        {/* Order Statistics */}
        <OrderStatistics />

        {/* Expense Overview */}
        <ExpenseOverview />

        {/* Transactions */}
        <TransactionsList />
      </div>
    </>
  );
};

export default DashboardPage;