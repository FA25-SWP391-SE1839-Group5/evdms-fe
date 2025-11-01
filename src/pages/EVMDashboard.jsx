import { useEffect, useState } from "react";
import DealerContractManagement from "../components/evm-dashboard/DealerContractManagement";
import DealerManagement from "../components/evm-dashboard/DealerManagement";
import InventoryManagement from "../components/evm-dashboard/InventoryManagement";
import DealerTotalSales from "../components/evm-dashboard/reports/DealerTotalSales";
import RegionTotalSales from "../components/evm-dashboard/reports/RegionTotalSales";
import VariantOrderRates from "../components/evm-dashboard/reports/VariantOrderRates";
import VehicleModelManagement from "../components/evm-dashboard/VehicleModelManagement";
import VehicleVariantManagement from "../components/evm-dashboard/VehicleVariantManagement";
import { getAllDealerContracts } from "../services/dealerService";
import { getAllInventories } from "../services/inventoryService";
import { getAllVehicleModels } from "../services/vehicleModelService";
import { getAllVehicleVariants } from "../services/vehicleVariantService";

const EVMDashboard = ({ currentPage }) => {
  // Dashboard stats state
  const [stats, setStats] = useState({
    vehicleModels: null,
    variants: null,
    activeDealers: null,
    pendingReview: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      setStats((s) => ({ ...s, loading: true, error: null }));
      try {
        const vehicleModelsRes = await getAllVehicleModels({ page: 0, pageSize: 0 });
        const vehicleVariantsRes = await getAllVehicleVariants({ page: 0, pageSize: 0 });
        // Fetch all dealer contracts and count active ones
        let activeDealers = null;
        try {
          const dealerContractsRes = await getAllDealerContracts({ page: 1, pageSize: 10000 });
          const now = new Date();
          activeDealers = (dealerContractsRes.items || []).filter((contract) => {
            const start = contract.startDate ? new Date(contract.startDate) : null;
            const end = contract.endDate ? new Date(contract.endDate) : null;
            return start && start <= now && (!end || end >= now);
          }).length;
        } catch {
          activeDealers = null;
        }
        // Low Stock: get all inventories, count those with quantity <= 5
        let lowStock = null;
        try {
          const inventoriesRes = await getAllInventories({ page: 1, pageSize: 10000 });
          lowStock = (inventoriesRes.items || []).filter((inv) => typeof inv.quantity === "number" && inv.quantity <= 5).length;
        } catch {
          lowStock = null;
        }
        setStats({
          vehicleModels: vehicleModelsRes.totalResults,
          variants: vehicleVariantsRes.totalResults,
          activeDealers,
          lowStock,
          loading: false,
          error: null,
        });
      } catch (err) {
        setStats((s) => ({ ...s, loading: false, error: err?.message || "Failed to load stats" }));
      }
    };
    fetchStats();
  }, []);

  const renderStatValue = (value) => {
    if (stats.loading)
      return (
        <span className="placeholder-glow">
          <span className="placeholder col-6"></span>
        </span>
      );
    if (stats.error) return <span className="text-danger">!</span>;
    return value !== null && value !== undefined ? value : <span className="text-muted">-</span>;
  };

  const renderContent = () => {
    switch (currentPage) {
      case "evm-dashboard":
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
              <div className="col-12">
                <div className="card mb-4">
                  <div className="card-body">
                    <div className="mb-4">
                      <h4 className="mb-1">Welcome to EVM Dashboard</h4>
                      <p className="mb-0 text-muted">Manage vehicles and dealers</p>
                    </div>

                    {/* Quick Stats */}
                    <div className="row g-3">
                      <div className="col-md-3">
                        <div className="card bg-primary text-white">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h5 className="text-white mb-1">{renderStatValue(stats.vehicleModels)}</h5>
                                <p className="mb-0 small">Vehicle Models</p>
                              </div>
                              <div className="avatar d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                                <i className="bx bx-car text-white bx-lg" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="card bg-success text-white">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h5 className="text-white mb-1">{renderStatValue(stats.variants)}</h5>
                                <p className="mb-0 small">Variants</p>
                              </div>
                              <div className="avatar d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                                <i className="bx bx-customize text-white bx-lg" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="card bg-info text-white">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h5 className="text-white mb-1">{renderStatValue(stats.activeDealers)}</h5>
                                <p className="mb-0 small">Active Dealers</p>
                              </div>
                              <div className="avatar d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                                <i className="bx bx-user-check text-white bx-lg" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="card bg-warning text-white">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h5 className="text-white mb-1">{renderStatValue(stats.lowStock)}</h5>
                                <p className="mb-0 small">Low Stock</p>
                              </div>
                              <div className="avatar d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                                <i className="bx bx-error text-white bx-lg" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-4">
                      <h5 className="mb-3">Quick Actions</h5>
                      <div className="d-flex flex-wrap gap-2">
                        <button className="btn btn-primary" onClick={() => (window.location.href = "/vehicle-models")}>
                          <i className="bx bx-plus me-2" />
                          Add New Model
                        </button>
                        <button className="btn btn-outline-primary" onClick={() => (window.location.href = "/vehicle-variants")}>
                          <i className="bx bx-customize me-2" />
                          Manage Variants
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
