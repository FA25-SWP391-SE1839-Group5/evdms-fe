import WelcomeCard from '../components/admin-dashboard/dashboard/WelcomeCard';
import StatCard from '../components/admin-dashboard/dashboard/StatCard';
import TotalRevenue from '../components/admin-dashboard/dashboard/TotalRevenue';
import ProfileReport from '../components/admin-dashboard/dashboard/ProfileReport';
import OrderStatistics from '../components/admin-dashboard/dashboard/OrderStatistics';
import ExpenseOverview from '../components/admin-dashboard/dashboard/ExpenseOverview';
import TransactionsList from '../components/admin-dashboard/dashboard/TransactionList';
import UserManagement from '../components/admin-dashboard/users/UserManagement';

const AdminDashboard = ({ currentPage = 'dashboard' }) => {
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

  // Render different pages based on currentPage
  const renderPageContent = () => {
    switch (currentPage) {
      case 'users':
        return <UserManagement />;
      
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
          <div className="container-xxl flex-grow-1 container-p-y">
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
          </div>
        );
    }
  };

  return renderPageContent();
};

export default AdminDashboard;