import { useEffect, useState, useCallback } from "react";
import DealerContractManagement from "../components/evm-dashboard/DealerContractManagement";
import DealerManagement from "../components/evm-dashboard/DealerManagement";
import InventoryManagement from "../components/evm-dashboard/InventoryManagement";
import DealerTotalSales from "../components/evm-dashboard/reports/DealerTotalSales";
import RegionTotalSales from "../components/evm-dashboard/reports/RegionTotalSales";
import VariantOrderRates from "../components/evm-dashboard/reports/VariantOrderRates";
import VehicleModelManagement from "../components/evm-dashboard/VehicleModelManagement";
import VehicleVariantManagement from "../components/evm-dashboard/VehicleVariantManagement";
import { getEVMDashboardStats, getInventoryDistribution, getContractTrends } from "../services/dashboardService";

const EVMDashboard = ({ currentPage }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initializeCharts = useCallback((invDist, statsData, contractData) => {
    if (typeof window.ApexCharts === "undefined") {
      console.error("ApexCharts is not loaded");
      return;
    }

    // Chart 1: Inventory Distribution (Donut Chart)
    const inventoryChartEl = document.querySelector("#inventoryDistributionChart");
    if (inventoryChartEl && invDist.length > 0) {
      inventoryChartEl.innerHTML = "";
      
      const inventoryChart = new window.ApexCharts(inventoryChartEl, {
        series: invDist.map(item => item.quantity),
        chart: { type: "donut", height: 300 },
        labels: invDist.map(item => item.name),
        colors: ["#696cff", "#03c3ec", "#71dd37", "#ffab00", "#ff3e1d", "#8592a3", "#d63384"],
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
                  label: "Total Units",
                  fontSize: "14px",
                  formatter: () => invDist.reduce((sum, item) => sum + item.quantity, 0),
                },
              },
            },
          },
        },
        responsive: [{ breakpoint: 480, options: { chart: { height: 250 }, legend: { position: "bottom" } } }],
      });
      inventoryChart.render();
    }

    // Chart 2: Dealers by Region (Bar Chart)
    const regionChartEl = document.querySelector("#dealersByRegionChart");
    if (regionChartEl && statsData?.dealersByRegion) {
      regionChartEl.innerHTML = "";
      const regions = Object.keys(statsData.dealersByRegion);
      const counts = Object.values(statsData.dealersByRegion);
      
      const regionChart = new window.ApexCharts(regionChartEl, {
        series: [{ name: "Dealers", data: counts }],
        chart: { type: "bar", height: 300, toolbar: { show: false } },
        plotOptions: { bar: { horizontal: false, columnWidth: "55%", borderRadius: 8 } },
        dataLabels: { enabled: false },
        colors: ["#696cff"],
        xaxis: { categories: regions, labels: { style: { fontSize: "13px" } } },
        yaxis: { labels: { style: { fontSize: "13px" } } },
        grid: { borderColor: "#f1f1f1" },
      });
      regionChart.render();
    }

    // Chart 3: Contract Trends (Line Chart)
    const contractChartEl = document.querySelector("#contractTrendsChart");
    if (contractChartEl && contractData.length > 0) {
      contractChartEl.innerHTML = "";
      
      const contractChart = new window.ApexCharts(contractChartEl, {
        series: [
          { name: "Active", data: contractData.map(item => item.active) },
          { name: "Pending", data: contractData.map(item => item.pending) },
        ],
        chart: { type: "line", height: 300, toolbar: { show: false } },
        colors: ["#71dd37", "#ffab00"],
        stroke: { width: 3, curve: "smooth" },
        dataLabels: { enabled: false },
        xaxis: {
          categories: contractData.map(item => {
            const [year, month] = item.month.split("-");
            return `${month}/${year}`;
          }),
          labels: { style: { fontSize: "13px" } },
        },
        yaxis: { labels: { style: { fontSize: "13px" } } },
        legend: { position: "top", fontSize: "13px" },
        grid: { borderColor: "#f1f1f1" },
      });
      contractChart.render();
    }

    // Chart 4: Inventory Status (Radial Bar)
    const statusChartEl = document.querySelector("#inventoryStatusChart");
    if (statusChartEl && statsData) {
      statusChartEl.innerHTML = "";
      const totalInv = statsData.totalInventory || 1;
      const availablePercent = Math.round((statsData.availableInventory / totalInv) * 100);
      
      const statusChart = new window.ApexCharts(statusChartEl, {
        series: [availablePercent],
        chart: { type: "radialBar", height: 280 },
        plotOptions: {
          radialBar: {
            hollow: { size: "65%" },
            dataLabels: {
              name: { show: true, fontSize: "16px" },
              value: { show: true, fontSize: "32px", fontWeight: 600, formatter: (val) => val + "%" },
            },
          },
        },
        colors: ["#71dd37"],
        labels: ["Available"],
      });
      statusChart.render();
    }
  }, []);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsData, invDist, contractData] = await Promise.all([
        getEVMDashboardStats(),
        getInventoryDistribution(),
        getContractTrends(),
      ]);

      setStats(statsData);
      
      setTimeout(() => {
        initializeCharts(invDist, statsData, contractData);
      }, 100);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [initializeCharts]);

  useEffect(() => {
    if (currentPage === "evm-dashboard") {
      loadDashboardData();
    }
  }, [currentPage, loadDashboardData]);

  const renderContent = () => {
    switch (currentPage) {
      case "evm-dashboard":
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
                      <i className="bx bx-car me-2 text-primary"></i>
                      EVM Dashboard
                    </h4>
                    <p className="text-muted mb-0">Electric Vehicle Manufacturer Management System</p>
                  </div>
                  <button 
                    className="btn btn-primary" 
                    onClick={loadDashboardData} 
                    disabled={loading}
                  >
                    <i className="bx bx-refresh me-1" />
                    Refresh
                  </button>
                </div>
                {/* Quick Stats */}
                <div className="row g-3 mb-4">
                  {/* Vehicle Models */}
                  <div className="col-xl-3 col-md-6">
                    <div className="card h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="flex-grow-1">
                            <span className="badge bg-label-primary mb-2">VEHICLES</span>
                            <h3 className="mb-1 fw-bold">{stats.totalVehicleModels}</h3>
                            <p className="mb-0 text-muted small">Vehicle Models</p>
                          </div>
                          <div className="avatar">
                            <div className="avatar-initial rounded bg-label-primary">
                              <i className="bx bx-car bx-sm" />
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          <div className="progress flex-grow-1 me-2" style={{ height: "6px" }}>
                            <div 
                              className="progress-bar bg-primary" 
                              style={{ width: `${Math.min((stats.totalVariants / stats.totalVehicleModels) * 10, 100)}%` }}
                            />
                          </div>
                          <small className="text-muted">{stats.totalVariants} Variants</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dealers */}
                  <div className="col-xl-3 col-md-6">
                    <div className="card h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="flex-grow-1">
                            <span className="badge bg-label-success mb-2">DEALERS</span>
                            <h3 className="mb-1 fw-bold">{stats.totalDealers}</h3>
                            <p className="mb-0 text-muted small">Active Dealers</p>
                          </div>
                          <div className="avatar">
                            <div className="avatar-initial rounded bg-label-success">
                              <i className="bx bx-store bx-sm" />
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          <div className="progress flex-grow-1 me-2" style={{ height: "6px" }}>
                            <div 
                              className="progress-bar bg-success" 
                              style={{ width: `${Math.min((stats.activeContracts / stats.totalDealers) * 100, 100)}%` }}
                            />
                          </div>
                          <small className="text-muted">{stats.activeContracts} Contracts</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Inventory */}
                  <div className="col-xl-3 col-md-6">
                    <div className="card h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="flex-grow-1">
                            <span className="badge bg-label-info mb-2">INVENTORY</span>
                            <h3 className="mb-1 fw-bold">{stats.totalInventory}</h3>
                            <p className="mb-0 text-muted small">Total Units</p>
                          </div>
                          <div className="avatar">
                            <div className="avatar-initial rounded bg-label-info">
                              <i className="bx bx-package bx-sm" />
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          <div className="progress flex-grow-1 me-2" style={{ height: "6px" }}>
                            <div 
                              className="progress-bar bg-info" 
                              style={{ width: `${Math.min((stats.availableInventory / stats.totalInventory) * 100, 100)}%` }}
                            />
                          </div>
                          <small className="text-muted">{stats.availableInventory} Available</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contracts */}
                  <div className="col-xl-3 col-md-6">
                    <div className="card h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="flex-grow-1">
                            <span className="badge bg-label-warning mb-2">CONTRACTS</span>
                            <h3 className="mb-1 fw-bold">{stats.totalContracts}</h3>
                            <p className="mb-0 text-muted small">Total Contracts</p>
                          </div>
                          <div className="avatar">
                            <div className="avatar-initial rounded bg-label-warning">
                              <i className="bx bx-file bx-sm" />
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          <span className="text-warning small me-2">
                            <i className="bx bx-time" />
                          </span>
                          <small className="text-muted">{stats.pendingContracts} Pending</small>
                          <span className="text-success small ms-auto">
                            <i className="bx bx-check-circle" /> {stats.activeContracts} Active
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Row */}
                <div className="row g-4 mb-4">
                  {/* Inventory Distribution */}
                  <div className="col-xl-4 col-lg-6">
                    <div className="card h-100">
                      <div className="card-header d-flex align-items-center justify-content-between pb-0">
                        <div>
                          <h5 className="card-title mb-1">Inventory Distribution</h5>
                          <p className="text-muted small mb-0">By Vehicle Type</p>
                        </div>
                        <div className="avatar">
                          <span className="avatar-initial rounded bg-label-info">
                            <i className="bx bx-package text-info"></i>
                          </span>
                        </div>
                      </div>
                      <div className="card-body">
                        <div id="inventoryDistributionChart"></div>
                      </div>
                    </div>
                  </div>

                  {/* Dealers by Region */}
                  <div className="col-xl-4 col-lg-6">
                    <div className="card h-100">
                      <div className="card-header d-flex align-items-center justify-content-between pb-0">
                        <div>
                          <h5 className="card-title mb-1">Dealers by Region</h5>
                          <p className="text-muted small mb-0">Geographic Distribution</p>
                        </div>
                        <div className="avatar">
                          <span className="avatar-initial rounded bg-label-success">
                            <i className="bx bx-map text-success"></i>
                          </span>
                        </div>
                      </div>
                      <div className="card-body">
                        <div id="dealersByRegionChart"></div>
                      </div>
                    </div>
                  </div>

                  {/* Inventory Status */}
                  <div className="col-xl-4 col-lg-12">
                    <div className="card h-100">
                      <div className="card-header d-flex align-items-center justify-content-between pb-0">
                        <div>
                          <h5 className="card-title mb-1">Inventory Status</h5>
                          <p className="text-muted small mb-0">Availability Rate</p>
                        </div>
                        <div className="avatar">
                          <span className="avatar-initial rounded bg-label-primary">
                            <i className="bx bx-pie-chart-alt text-primary"></i>
                          </span>
                        </div>
                      </div>
                      <div className="card-body d-flex flex-column align-items-center justify-content-center">
                        <div id="inventoryStatusChart"></div>
                        <div className="w-100 mt-3">
                          <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                            <div className="d-flex align-items-center">
                              <span className="badge badge-dot bg-success me-2"></span>
                              <span className="text-muted">Available</span>
                            </div>
                            <span className="fw-semibold">{stats.availableInventory} units</span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <span className="badge badge-dot bg-secondary me-2"></span>
                              <span className="text-muted">Allocated</span>
                            </div>
                            <span className="fw-semibold">{stats.allocatedInventory || (stats.totalInventory - stats.availableInventory)} units</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contract Trends - Full Width */}
                <div className="row g-4 mb-4">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header d-flex align-items-center justify-content-between pb-0">
                        <div>
                          <h5 className="card-title mb-1">Contract Trends</h5>
                          <p className="text-muted small mb-0">Monthly Active vs Pending Contracts</p>
                        </div>
                        <div className="avatar">
                          <span className="avatar-initial rounded bg-label-warning">
                            <i className="bx bx-line-chart text-warning"></i>
                          </span>
                        </div>
                      </div>
                      <div className="card-body">
                        <div id="contractTrendsChart"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title mb-1">Quick Actions</h5>
                        <p className="text-muted small mb-0">Manage your EVM operations</p>
                      </div>
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-lg-3 col-md-6">
                            <button 
                              className="btn btn-outline-primary w-100 d-flex flex-column align-items-center py-3" 
                              onClick={() => (window.location.href = "/vehicle-models")}
                            >
                              <i className="bx bx-car bx-lg mb-2" />
                              <span className="fw-semibold">Vehicle Models</span>
                              <small className="text-muted">Add & Manage</small>
                            </button>
                          </div>
                          <div className="col-lg-3 col-md-6">
                            <button 
                              className="btn btn-outline-success w-100 d-flex flex-column align-items-center py-3" 
                              onClick={() => (window.location.href = "/vehicle-variants")}
                            >
                              <i className="bx bx-customize bx-lg mb-2" />
                              <span className="fw-semibold">Vehicle Variants</span>
                              <small className="text-muted">Configure Options</small>
                            </button>
                          </div>
                          <div className="col-lg-3 col-md-6">
                            <button 
                              className="btn btn-outline-info w-100 d-flex flex-column align-items-center py-3" 
                              onClick={() => (window.location.href = "/dealers")}
                            >
                              <i className="bx bx-store bx-lg mb-2" />
                              <span className="fw-semibold">Dealers</span>
                              <small className="text-muted">View & Manage</small>
                            </button>
                          </div>
                          <div className="col-lg-3 col-md-6">
                            <button 
                              className="btn btn-outline-warning w-100 d-flex flex-column align-items-center py-3" 
                              onClick={() => (window.location.href = "/oem-inventories")}
                            >
                              <i className="bx bx-package bx-lg mb-2" />
                              <span className="fw-semibold">OEM Inventory</span>
                              <small className="text-muted">View & Monitor</small>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        );

      case "vehicle-models":
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <VehicleModelManagement />
          </div>
        );

      case "dealers":
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <DealerManagement />
          </div>
        );

      case "dealer-contracts":
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <DealerContractManagement />
          </div>
        );

      case "oem-inventories":
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <InventoryManagement />
          </div>
        );

      case "vehicle-variants":
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <VehicleVariantManagement />
          </div>
        );

      case "variant-order-rates":
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <VariantOrderRates />
          </div>
        );
      case "dealer-total-sales":
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <DealerTotalSales />
          </div>
        );
      case "region-total-sales":
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <RegionTotalSales />
          </div>
        );

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

export default EVMDashboard;
