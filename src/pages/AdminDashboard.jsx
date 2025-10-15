import React, { useState, useEffect } from 'react';
import Sidebar from '../components/admin-dashboard/Sidebar';
import Navbar from '../components/admin-dashboard/NavBar';
import StatsCards from '../components/admin-dashboard/StatsCards';
import RecentOrders from '../components/admin-dashboard/RecentOrders';
import TestDrivesList from '../components/admin-dashboard/TestDriveList';
import APIStatus from '../components/admin-dashboard/APIStatus';
import UserManagement from '../components/admin-dashboard/UserManagement';
import DealerManagement from '../components/admin-dashboard/dealer/DealerManagement';
import api from '../services/api';

const AdminDashboard = ({ user, onLogout }) => {
  const [stats, setStats] = useState({
    dealers: 0,
    customers: 0,
    vehicles: 0,
    orders: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [testDrives, setTestDrives] = useState([]);
  const [apiStatus, setApiStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');

  // Load dashboard data
  useEffect(() => {
    if (activeSection === 'dashboard') {
      loadDashboardData();
      checkAPIStatus();

      // Auto-refresh every 30 seconds only for dashboard
      const interval = setInterval(() => {
        loadDashboardData();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [activeSection]);

  const loadDashboardData = async () => {
    setLoading(true);

    try {
      // Fetch all data in parallel
      const [dealers, customers, inventory, orders, drives] = await Promise.all([
        api.get('/dealers').catch(() => ({ data: { data: [] } })),
        api.get('/customers').catch(() => ({ data: { data: [] } })),
        api.get('/oem-inventories').catch(() => ({ data: { data: [] } })),
        api.get('/sales-orders').catch(() => ({ data: { data: [] } })),
        api.get('/test-drives').catch(() => ({ data: { data: [] } }))
      ]);

      // Update stats
      setStats({
        dealers: dealers.data?.data?.length || dealers.data?.total || 0,
        customers: customers.data?.data?.length || customers.data?.total || 0,
        vehicles: inventory.data?.data?.items?.length || inventory.data?.total || 0,
        orders: orders.data?.data?.length || orders.data?.total || 0
      });

      // Set recent orders
      const ordersArray = Array.isArray(orders.data?.data) ? orders.data.data : orders.data?.data?.items || [];
      setRecentOrders(ordersArray.slice(0, 5));

      // Set test drives
      const drivesArray = Array.isArray(drives.data?.data) ? drives.data.data : drives.data?.data?.items || [];
      setTestDrives(drivesArray.slice(0, 5));

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAPIStatus = async () => {
    const endpoints = [
      { name: 'Dealers', path: '/dealers' },
      { name: 'Customers', path: '/customers' },
      { name: 'Inventory', path: '/oem-inventories' },
      { name: 'Vehicle Models', path: '/vehicle-models' },
      { name: 'Sales Orders', path: '/sales-orders' },
      { name: 'Test Drives', path: '/test-drives' },
      { name: 'Payments', path: '/payments' },
      { name: 'Promotions', path: '/promotions' },
      { name: 'Users', path: '/users' }
    ];

    const statusChecks = await Promise.all(
      endpoints.map(async (endpoint) => {
        const startTime = Date.now();
        try {
          const response = await api.get(endpoint.path);
          const responseTime = Date.now() - startTime;
          return {
            name: endpoint.name,
            path: endpoint.path,
            status: response.status === 200 ? 'OK' : 'Error',
            responseTime: `${responseTime}ms`
          };
        } catch (error) {
          console.error(`API status check failed for ${endpoint.path}:`, error);
          return {
            name: endpoint.name,
            path: endpoint.path,
            status: 'Failed',
            responseTime: '-'
          };
        }
      })
    );

    setApiStatus(statusChecks);
  };

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'users':
        return <UserManagement />;

      case 'dealers':
        return <DealerManagement />;

      case 'customers':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Customer Management</h2>
            <p className="text-gray-600">Customer management page - Coming soon...</p>
          </div>
        );

      case 'inventory':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Vehicle Inventory</h2>
            <p className="text-gray-600">Inventory management page - Coming soon...</p>
          </div>
        );

      case 'dashboard':
      default:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
            <StatsCards stats={stats} loading={loading} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <RecentOrders orders={recentOrders} loading={loading} />
              </div>
              <div>
                <TestDrivesList testDrives={testDrives} loading={loading} />
              </div>
            </div>

            <APIStatus apiStatus={apiStatus} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main Content */}
      <div className="flex-1" style={{ marginLeft: sidebarOpen ? '16rem' : '0' }}>
        {/* Top Navbar */}
        <Navbar
          user={user}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onLogout={onLogout}
        />

        {/* Content Area */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
