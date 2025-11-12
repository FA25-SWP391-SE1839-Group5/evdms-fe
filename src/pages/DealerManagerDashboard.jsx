import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

// Your component imports
import DealerOrdersPage from "../components/dealer-mananger-dashboard/dealer-orders/DealerOrdersPage";
import DealerPaymentsPage from "../components/dealer-mananger-dashboard/dealer-payments/DealerPaymentsPage";
import PromotionManagement from "../components/dealer-mananger-dashboard/PromotionManagement";
import StaffManagement from "../components/dealer-mananger-dashboard/staff-management/StaffManagement";
import StaffPerformancePage from "../components/dealer-mananger-dashboard/staff-performance/StaffPerformancePage";
import VehicleModelBrowse from "../components/dealer-mananger-dashboard/VehicleModelBrowse";

// --- Import your services ---
import { getAllOrders, getAllPayments, getAllUsers, getCurrentUser } from "../services/dashboardService"; // <-- TODO: Make sure this path is correct

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DealerManagerDashboard = ({ currentPage }) => {
  // --- State for your data ---
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kpiData, setKpiData] = useState({
    carsSold: 0,
    revenue: 0,
    pendingOrders: 0,
    activeStaff: 0,
  });
  const [topStaff, setTopStaff] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesChartData, setSalesChartData] = useState({
    labels: [],
    datasets: [],
  });

  // --- useEffect to fetch data (USES BACKEND FILTERING) ---
  useEffect(() => {
    if (currentPage === "dealer-dashboard") {
      const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const userRes = await getCurrentUser();
          const myDealerId = userRes.data.data?.dealerId;
          console.log("Current User's Dealer ID:", myDealerId);
          if (!myDealerId) {
            throw new Error("Could not determine Dealer ID for the current user.");
          }
          // phan nay` voi check dum` cai dashboardService.
          const filters = { filters: JSON.stringify({ dealerId: myDealerId }) };
          const [ordersRes, usersRes, paymentsRes] = await Promise.all([
            getAllOrders(filters), // <-- Sends { filters: '{"dealerId":"..."}' }
            getAllUsers(filters), // <-- Sends { filters: '{"dealerId":"..."}' }
            getAllPayments({ pageSize: 100 }), // <-- Still fetch all payments
          ]);

          // --- Data is now pre-filtered by the API ---
          const myOrders = ordersRes.data?.items || [];
          const myStaff = usersRes.data?.items || [];
          const allPayments = paymentsRes.data?.items || [];

          // Step 3: Process the data
          processDashboardData(myOrders, myStaff, allPayments);
        } catch (err) {
          console.error("Failed to fetch dashboard data:", err);
          setError(err.message || "Failed to load dashboard.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [currentPage]);

  /**
   * Helper function to calculate all dashboard data
   */
  const processDashboardData = (myOrders, myStaff, allPayments) => {
    // --- Calculate KPIs ---
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const deliveredMonthlyOrders = myOrders.filter((o) => new Date(o.createdAt) >= startOfMonth && o.status === "Delivered");

    const deliveredMonthlyOrderIds = new Set(deliveredMonthlyOrders.map((o) => o.id));

    // We still filter payments on the frontend, which is fast.
    const monthlyRevenue = allPayments.filter((p) => deliveredMonthlyOrderIds.has(p.salesOrderId)).reduce((sum, p) => sum + (p.amount || 0), 0);

    const kpis = {
      carsSold: deliveredMonthlyOrders.length,
      revenue: monthlyRevenue,
      pendingOrders: myOrders.filter((o) => o.status === "Pending").length,
      activeStaff: myStaff.filter((s) => s.isActive).length,
    };
    setKpiData(kpis);

    // --- Get Top Staff ---
    const allDeliveredOrders = myOrders.filter((o) => o.status === "Delivered");

    const salesByStaff = allDeliveredOrders.reduce((acc, order) => {
      if (!order.userId) return acc;

      const currentSales = acc[order.userId]?.sales || 0;
      acc[order.userId] = {
        name: order.userFullName,
        sales: currentSales + 1,
      };
      return acc;
    }, {});

    const topStaffData = Object.entries(salesByStaff)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    setTopStaff(topStaffData);

    // --- Get Recent Orders ---
    const recentOrdersData = myOrders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((o) => ({
        id: o.id,
        customerName: o.customerFullName,
        status: o.status,
      }));
    setRecentOrders(recentOrdersData);

    // --- Generate Chart Data ---
    const chartLabels = [];
    const chartSalesData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthLabel = d.toLocaleString("en-US", { month: "short" });
      const year = d.getFullYear();
      chartLabels.push(`${monthLabel} ${year}`);

      const salesInMonth = myOrders.filter((o) => {
        const orderDate = new Date(o.createdAt);
        return o.status === "Delivered" && orderDate.getFullYear() === d.getFullYear() && orderDate.getMonth() === d.getMonth();
      }).length;
      chartSalesData.push(salesInMonth);
    }

    setSalesChartData({
      labels: chartLabels,
      datasets: [
        {
          label: "Cars Sold",
          data: chartSalesData,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
      ],
    });
  };

  // --- RENDER LOGIC ---

  const renderDashboardOverview = () => {
    if (isLoading) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="alert alert-danger" role="alert">
          <strong>Error:</strong> {error}
        </div>
      );
    }

    return (
      <>
        {/* Welcome Banner */}
        <div className="row">
          <div className="col-12">
            <div className="card mb-4">
              <div className="card-body">
                <h4 className="mb-1">Welcome, Dealer Manager!</h4>
                <p className="mb-0 text-muted">Here's your sales and staff overview for today.</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- THIS BLOCK IS NOW CORRECTED --- */}
        <div className="row">
          <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
            <div className="card">
              <div className="card-body">
                <span className="text-muted">Cars Sold (Month)</span>
                <h3 className="mb-0 mt-2">{kpiData.carsSold}</h3>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
            <div className="card">
              <div className="card-body">
                <span className="text-muted">Monthly Revenue</span>
                <h3 className="mb-0 mt-2">${kpiData.revenue.toLocaleString()}</h3>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
            <div className="card">
              <div className="card-body">
                <span className="text-muted">Pending Orders</span>
                <h3 className="mb-0 mt-2">{kpiData.pendingOrders}</h3>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
            <div className="card">
              <div className="card-body">
                <span className="text-muted">Active Staff</span>
                <h3 className="mb-0 mt-2">{kpiData.activeStaff}</h3>
              </div>
            </div>
          </div>
        </div>
        {/* --- END OF CORRECTION --- */}

        {/* Chart Row */}
        <div className="row">
          <div className="col-12 mb-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Sales Overview (Last 6 Months)</h5>
              </div>
              <div className="card-body">
                <Bar
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "top" },
                      title: { display: true, text: "Monthly Car Sales" },
                    },
                  }}
                  data={salesChartData}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Data Lists Row */}
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Top Staff Performers</h5>
                <a href="#dealer-performance" className="btn btn-sm btn-outline-primary">
                  View All
                </a>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  {topStaff.length > 0 ? (
                    topStaff.map((staff, index) => (
                      <li key={staff.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>
                          {index + 1}. {staff.name}
                        </span>
                        <span className="badge bg-primary">{staff.sales} Sales</span>
                      </li>
                    ))
                  ) : (
                    <li className="list-group-item">No staff sales data available.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Recent Orders</h5>
                <a href="#dealer-orders" className="btn btn-sm btn-outline-primary">
                  View All
                </a>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <li key={order.id} className="list-group-item">
                        <strong>Order #{order.id.substring(0, 8)}...</strong> - {order.customerName}
                        <span
                          className={`badge bg-${order.status === "Delivered" ? "success" : order.status === "Pending" ? "warning" : order.status === "Cancelled" ? "danger" : "secondary"} float-end`}
                        >
                          {order.status}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="list-group-item">No recent orders.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Render content based on the currentPage prop
  const renderContent = () => {
    switch (currentPage) {
      case "dealer-staff":
        return <StaffManagement />;
      case "dealer-performance":
        return <StaffPerformancePage />;
      case "vehicle-model-browse":
        return <VehicleModelBrowse />;
      case "dealer-orders":
        return <DealerOrdersPage />;
      case "dealer-payments":
        return <DealerPaymentsPage />;
      case "dealer-promotions":
        return <PromotionManagement />;
      case "dealer-dashboard":
      default:
        return renderDashboardOverview();
    }
  };

  return <div className="container-xxl flex-grow-1 container-p-y">{renderContent()}</div>;
};

export default DealerManagerDashboard;
