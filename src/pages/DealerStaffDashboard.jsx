import { useCallback, useEffect, useState } from "react";
import CustomerManagement from "../components/dealer-dashboard/CustomerManagement";
import FeedbackManagement from "../components/dealer-dashboard/FeedbackManagement";
import QuotationManagement from "../components/dealer-dashboard/QuotationManagement";
import SalesOrderManagement from "../components/dealer-dashboard/SalesOrderManagement";
import TestDriveManagement from "../components/dealer-dashboard/TestDriveManagement";
import VehicleManagement from "../components/dealer-dashboard/VehicleManagement";
import { getAllFeedbacks } from "../services/feedbackService";
import { getAllSalesOrders } from "../services/salesOrderService";
import { getAllTestDrives } from "../services/testDriveService";
import { decodeJwt } from "../utils/jwt";

const DealerStaffDashboard = ({ currentPage }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentTestDrives, setRecentTestDrives] = useState([]);

  const initializeCharts = useCallback((salesOrdersData, testDrivesData, feedbacksData) => {
    if (typeof window.ApexCharts === "undefined") {
      console.error("ApexCharts is not loaded");
      return;
    }

    // Chart 1: Sales Orders Status (Donut Chart)
    const salesOrdersChartEl = document.querySelector("#salesOrdersStatusChart");
    if (salesOrdersChartEl && salesOrdersData.length > 0) {
      salesOrdersChartEl.innerHTML = "";

      const statusCounts = salesOrdersData.reduce((acc, order) => {
        const status = order.status || "Pending";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const salesOrdersChart = new window.ApexCharts(salesOrdersChartEl, {
        series: Object.values(statusCounts),
        chart: { type: "donut", height: 300 },
        labels: Object.keys(statusCounts),
        colors: ["#ffab00", "#03c3ec", "#71dd37", "#ff3e1d"],
        legend: { position: "bottom", fontSize: "13px" },
        plotOptions: {
          pie: {
            donut: {
              size: "65%",
              labels: {
                show: true,
                name: { show: true, fontSize: "18px" },
                value: { show: true, fontSize: "24px", fontWeight: 600 },
                total: {
                  show: true,
                  label: "Total Orders",
                  fontSize: "14px",
                  formatter: () => salesOrdersData.length,
                },
              },
            },
          },
        },
      });
      salesOrdersChart.render();
    }

    // Chart 2: Test Drives Status (Bar Chart)
    const testDrivesChartEl = document.querySelector("#testDrivesStatusChart");
    if (testDrivesChartEl && testDrivesData.length > 0) {
      testDrivesChartEl.innerHTML = "";

      const statusCounts = testDrivesData.reduce((acc, td) => {
        const status = td.status || "Scheduled";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const categories = Object.keys(statusCounts);
      const series = Object.values(statusCounts);

      // Define colors for each status
      const statusColors = categories.map((status) => {
        switch (status) {
          case "Scheduled":
            return "#696cff"; // Primary blue
          case "Completed":
            return "#71dd37"; // Success green
          case "Cancelled":
            return "#ff3e1d"; // Danger red
          case "InProgress":
            return "#03c3ec"; // Info cyan
          default:
            return "#8592a3"; // Secondary gray
        }
      });

      const testDrivesChart = new window.ApexCharts(testDrivesChartEl, {
        series: [{ name: "Test Drives", data: series }],
        chart: { type: "bar", height: 300, toolbar: { show: false } },
        colors: statusColors,
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            borderRadius: 5,
            distributed: true, // Enable different color for each bar
          },
        },
        dataLabels: { enabled: false },
        legend: { show: false }, // Hide legend since we're using distributed colors
        xaxis: {
          categories: categories,
          labels: { style: { fontSize: "13px" } },
        },
        yaxis: { labels: { style: { fontSize: "13px" } } },
        grid: { borderColor: "#f1f1f1" },
      });
      testDrivesChart.render();
    }

    // Chart 3: Feedbacks Status (Radial Bar Chart)
    const feedbacksChartEl = document.querySelector("#feedbacksStatusChart");
    if (feedbacksChartEl && feedbacksData.length > 0) {
      feedbacksChartEl.innerHTML = "";

      const newCount = feedbacksData.filter((f) => f.status === "New").length;
      const reviewedCount = feedbacksData.filter((f) => f.status === "Reviewed").length;
      const resolvedCount = feedbacksData.filter((f) => f.status === "Resolved").length;
      const total = feedbacksData.length;

      const newPercent = total > 0 ? Math.round((newCount / total) * 100) : 0;
      const reviewedPercent = total > 0 ? Math.round((reviewedCount / total) * 100) : 0;
      const resolvedPercent = total > 0 ? Math.round((resolvedCount / total) * 100) : 0;

      const feedbacksChart = new window.ApexCharts(feedbacksChartEl, {
        series: [newPercent, reviewedPercent, resolvedPercent],
        chart: { type: "radialBar", height: 350 },
        colors: ["#696cff", "#03c3ec", "#71dd37"],
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: { fontSize: "16px" },
              value: { fontSize: "14px" },
              total: {
                show: true,
                label: "Total Feedbacks",
                formatter: () => total,
              },
            },
          },
        },
        labels: ["New", "Reviewed", "Resolved"],
        legend: { position: "bottom", fontSize: "13px" },
      });
      feedbacksChart.render();
    }
  }, []);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get dealerId from JWT (same logic as SalesOrderManagement)
      let dealerId = null;
      try {
        const token = localStorage.getItem("evdms_auth_token");
        if (token) {
          const decoded = decodeJwt(token);
          dealerId = decoded?.dealerId;
        }
      } catch (e) {
        console.debug("Error decoding JWT for dealerId:", e);
      }

      // Always filter by dealerId if present
      const baseParams = { page: 1, pageSize: 100 };
      let salesOrderParams = { ...baseParams };
      let testDriveParams = { ...baseParams };
      let feedbackParams = { ...baseParams };

      if (dealerId) {
        const filters = JSON.stringify({ dealerId });
        salesOrderParams.filters = filters;
        testDriveParams.filters = filters;
        feedbackParams.filters = filters;
      }

      const [salesOrdersResponse, testDrivesResponse, feedbacksResponse] = await Promise.all([getAllSalesOrders(salesOrderParams), getAllTestDrives(testDriveParams), getAllFeedbacks(feedbackParams)]);

      const salesOrders = salesOrdersResponse?.data?.items || [];
      const testDrives = testDrivesResponse?.data?.items || [];
      const feedbacks = feedbacksResponse?.data?.items || [];

      // Calculate stats from Sales Orders
      const pendingSalesOrders = salesOrders.filter((o) => o.status === "Pending").length;
      const confirmedSalesOrders = salesOrders.filter((o) => o.status === "Confirmed").length;
      const completedSalesOrders = salesOrders.filter((o) => o.status === "Completed").length;

      // Calculate stats from Test Drives
      const scheduledTestDrives = testDrives.filter((td) => td.status === "Scheduled").length;
      const completedTestDrives = testDrives.filter((td) => td.status === "Completed").length;

      // Calculate stats from Feedbacks
      const newFeedbacks = feedbacks.filter((f) => f.status === "New").length;
      const reviewedFeedbacks = feedbacks.filter((f) => f.status === "Reviewed").length;
      const resolvedFeedbacks = feedbacks.filter((f) => f.status === "Resolved").length;

      // Aggregate stats
      const statsData = {
        // Sales Orders
        totalSalesOrders: salesOrders.length,
        pendingSalesOrders,
        confirmedSalesOrders,
        completedSalesOrders,

        // Test Drives
        totalTestDrives: testDrives.length,
        scheduledTestDrives,
        completedTestDrives,

        // Feedbacks
        totalFeedbacks: feedbacks.length,
        newFeedbacks,
        reviewedFeedbacks,
        resolvedFeedbacks,

        // Quotations (placeholders — replace with real data/service when available)
        totalQuotations: 0,
        pendingQuotations: 0,
        approvedQuotations: 0,
      };

      setStats(statsData);
      setRecentOrders(salesOrders.slice(0, 5));
      setRecentTestDrives(testDrives.slice(0, 5));

      setTimeout(() => {
        initializeCharts(salesOrders, testDrives, feedbacks);
      }, 100);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [initializeCharts]);

  useEffect(() => {
    if (currentPage === "staff-dashboard") {
      loadDashboardData();
    }
  }, [currentPage, loadDashboardData]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderContent = () => {
    switch (currentPage) {
      case "staff-dashboard":
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <i className="bx bx-error me-2" />
                {error}
                <button type="button" className="btn-close" onClick={() => setError(null)} />
              </div>
            )}

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading dashboard data...</p>
              </div>
            ) : stats ? (
              <>
                {/* Header with Title and Refresh Button */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h4 className="fw-bold mb-1">
                      <i className="bx bx-store me-2 text-primary"></i>
                      Dealer Staff Dashboard
                    </h4>
                    <p className="text-muted mb-0">Manage sales orders, test drives, and feedbacks</p>
                  </div>
                  <button className="btn btn-primary" onClick={loadDashboardData} disabled={loading}>
                    <i className="bx bx-refresh me-1" />
                    Refresh
                  </button>
                </div>
                {/* Quick Stats */}
                <div className="row g-3 mb-4">
                  {/* Sales Orders - Total */}
                  <div className="col-xl-3 col-md-6">
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <span className="badge bg-label-primary mb-2">SALES ORDERS</span>
                            <h3 className="mb-1">{stats.totalSalesOrders}</h3>
                            <p className="mb-0 text-muted small">Total Orders</p>
                          </div>
                          <div className="avatar">
                            <div className="avatar-initial rounded bg-label-primary">
                              <i className="bx bx-shopping-bag bx-sm" />
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <span className="text-warning small">
                            <i className="bx bx-time" /> {stats.pendingSalesOrders} Pending
                          </span>
                          <span className="text-success small ms-2">
                            <i className="bx bx-check" /> {stats.completedSalesOrders} Completed
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sales Orders - Confirmed */}
                  <div className="col-xl-3 col-md-6">
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <span className="badge bg-label-info mb-2">CONFIRMED</span>
                            <h3 className="mb-1">{stats.confirmedSalesOrders}</h3>
                            <p className="mb-0 text-muted small">Confirmed Orders</p>
                          </div>
                          <div className="avatar">
                            <div className="avatar-initial rounded bg-label-info">
                              <i className="bx bx-check-circle bx-sm" />
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <span className="text-info small">
                            <i className="bx bx-trending-up" /> Ready to Process
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Test Drives */}
                  <div className="col-xl-3 col-md-6">
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <span className="badge bg-label-success mb-2">TEST DRIVES</span>
                            <h3 className="mb-1">{stats.totalTestDrives}</h3>
                            <p className="mb-0 text-muted small">Total Test Drives</p>
                          </div>
                          <div className="avatar">
                            <div className="avatar-initial rounded bg-label-success">
                              <i className="bx bx-car bx-sm" />
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <span className="text-primary small">
                            <i className="bx bx-calendar" /> {stats.scheduledTestDrives} Scheduled
                          </span>
                          <span className="text-success small ms-2">
                            <i className="bx bx-check" /> {stats.completedTestDrives} Completed
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feedbacks */}
                  <div className="col-xl-3 col-md-6">
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <span className="badge bg-label-warning mb-2">FEEDBACKS</span>
                            <h3 className="mb-1">{stats.totalFeedbacks}</h3>
                            <p className="mb-0 text-muted small">Total Feedbacks</p>
                          </div>
                          <div className="avatar">
                            <div className="avatar-initial rounded bg-label-warning">
                              <i className="bx bx-message-square-dots bx-sm" />
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <span className="text-primary small">
                            <i className="bx bx-bell" /> {stats.newFeedbacks} New
                          </span>
                          <span className="text-success small ms-2">
                            <i className="bx bx-check-double" /> {stats.resolvedFeedbacks} Resolved
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quotations */}
                  <div className="col-xl-3 col-md-6">
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <span className="badge bg-label-secondary mb-2">QUOTATIONS</span>
                            <h3 className="mb-1">{stats.totalQuotations}</h3>
                            <p className="mb-0 text-muted small">Total Quotations</p>
                          </div>
                          <div className="avatar">
                            <div className="avatar-initial rounded bg-label-secondary">
                              <i className="bx bx-file bx-sm" />
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <span className="text-warning small">
                            <i className="bx bx-time" /> {stats.pendingQuotations} Pending
                          </span>
                          <span className="text-success small ms-2">
                            <i className="bx bx-check" /> {stats.approvedQuotations} Approved
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Row */}
                <div className="row g-4 mb-4">
                  {/* Sales Orders Status */}
                  <div className="col-xl-4">
                    <div className="card h-100">
                      <div className="card-header">
                        <h5 className="card-title m-0">Sales Orders by Status</h5>
                      </div>
                      <div className="card-body">
                        <div id="salesOrdersStatusChart"></div>
                      </div>
                    </div>
                  </div>

                  {/* Test Drives Status */}
                  <div className="col-xl-4">
                    <div className="card h-100">
                      <div className="card-header">
                        <h5 className="card-title m-0">Test Drives by Status</h5>
                      </div>
                      <div className="card-body">
                        <div id="testDrivesStatusChart"></div>
                      </div>
                    </div>
                  </div>

                  {/* Feedbacks Status */}
                  <div className="col-xl-4">
                    <div className="card h-100">
                      <div className="card-header">
                        <h5 className="card-title m-0">Feedbacks Distribution</h5>
                      </div>
                      <div className="card-body">
                        <div id="feedbacksStatusChart"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="row g-4">
                  {/* Recent Sales Orders */}
                  <div className="col-xl-6">
                    <div className="card">
                      <div className="card-header d-flex align-items-center justify-content-between">
                        <h5 className="card-title m-0">Recent Sales Orders</h5>
                        <span className="badge bg-primary">{stats.totalSalesOrders} Total</span>
                      </div>
                      <div className="card-body">
                        {recentOrders.length > 0 ? (
                          <div className="table-responsive">
                            <table className="table table-sm">
                              <thead>
                                <tr>
                                  <th>Order ID</th>
                                  <th>Customer</th>
                                  <th>Status</th>
                                  <th>Date</th>
                                </tr>
                              </thead>
                              <tbody>
                                {recentOrders.map((order) => (
                                  <tr key={order.id}>
                                    <td>
                                      <span className="badge bg-label-secondary">{order.id?.substring(0, 8) || "N/A"}</span>
                                    </td>
                                    <td>
                                      <small className="text-muted">{order.customerId?.substring(0, 8) || "N/A"}...</small>
                                    </td>
                                    <td>
                                      <span
                                        className={`badge ${
                                          order.status === "Completed"
                                            ? "bg-success"
                                            : order.status === "Confirmed"
                                            ? "bg-info"
                                            : order.status === "Pending"
                                            ? "bg-warning"
                                            : order.status === "Cancelled"
                                            ? "bg-danger"
                                            : "bg-secondary"
                                        }`}
                                      >
                                        {order.status || "N/A"}
                                      </span>
                                    </td>
                                    <td className="text-muted small">{formatDate(order.date)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center py-4 text-muted">
                            <i className="bx bx-shopping-bag bx-lg mb-2" />
                            <p>No recent sales orders</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Recent Test Drives */}
                  <div className="col-xl-6">
                    <div className="card">
                      <div className="card-header d-flex align-items-center justify-content-between">
                        <h5 className="card-title m-0">Recent Test Drives</h5>
                        <span className="badge bg-success">{stats.totalTestDrives} Total</span>
                      </div>
                      <div className="card-body">
                        {recentTestDrives.length > 0 ? (
                          <div className="table-responsive">
                            <table className="table table-sm">
                              <thead>
                                <tr>
                                  <th>Customer</th>
                                  <th>Vehicle</th>
                                  <th>Date</th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {recentTestDrives.map((td) => (
                                  <tr key={td.id}>
                                    <td>
                                      <small className="text-muted">{td.customerId?.substring(0, 8) || "N/A"}...</small>
                                    </td>
                                    <td>
                                      <small className="text-muted">{td.vehicleId?.substring(0, 8) || "N/A"}...</small>
                                    </td>
                                    <td className="text-muted small">{formatDateTime(td.scheduledAt)}</td>
                                    <td>
                                      <span
                                        className={`badge ${
                                          td.status === "Completed"
                                            ? "bg-success"
                                            : td.status === "Scheduled"
                                            ? "bg-primary"
                                            : td.status === "InProgress"
                                            ? "bg-info"
                                            : td.status === "Cancelled"
                                            ? "bg-danger"
                                            : "bg-secondary"
                                        }`}
                                      >
                                        {td.status || "N/A"}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center py-4 text-muted">
                            <i className="bx bx-car bx-lg mb-2" />
                            <p>No recent test drives</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        );

      case "feedbacks":
        return <FeedbackManagement />;

      case "test-drives":
        return <TestDriveManagement />;

      case "sales-orders":
        return <SalesOrderManagement />;

      case "customers":
        return <CustomerManagement />;

      case "vehicle":
        return <VehicleManagement />;

      case "quotations":
        return <QuotationManagement />;

      default:
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <div className="misc-wrapper">
              <h2 className="mb-2 mx-2">Page Not Found</h2>
              <p className="mb-4 mx-2">The page you are looking for does not exist.</p>
            </div>
          </div>
        );
    }
  };

  return <>{renderContent()}</>;
};

export default DealerStaffDashboard;
