import DealerContractManagement from "../components/evm-dashboard/DealerContractManagement";
import DealerManagement from "../components/evm-dashboard/DealerManagement";
import InventoryManagement from "../components/evm-dashboard/InventoryManagement";
import VehicleModelManagement from "../components/evm-dashboard/VehicleModelManagement";
import VehicleVariantManagement from "../components/evm-dashboard/VehicleVariantManagement";

const EVMDashboard = ({ currentPage }) => {
  const renderContent = () => {
    switch (currentPage) {
      case "evm-dashboard":
        return (
          <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row">
              <div className="col-12">
                <div className="card mb-4">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-4">
                      <div className="avatar avatar-xl me-3 bg-label-primary rounded">
                        <i className="bx bx-car bx-lg" />
                      </div>
                      <div>
                        <h4 className="mb-1">Welcome to EVM Dashboard</h4>
                        <p className="mb-0 text-muted">Manage vehicle models and variants</p>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="row g-3">
                      <div className="col-md-3">
                        <div className="card bg-primary text-white">
                          <div className="card-body">
                            <div className="d-flex justify-content-between">
                              <div>
                                <h5 className="text-white mb-1">45</h5>
                                <p className="mb-0 small">Vehicle Models</p>
                              </div>
                              <div className="avatar bg-white bg-opacity-25">
                                <i className="bx bx-car text-white" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="card bg-success text-white">
                          <div className="card-body">
                            <div className="d-flex justify-content-between">
                              <div>
                                <h5 className="text-white mb-1">128</h5>
                                <p className="mb-0 small">Variants</p>
                              </div>
                              <div className="avatar bg-white bg-opacity-25">
                                <i className="bx bx-customize text-white" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="card bg-info text-white">
                          <div className="card-body">
                            <div className="d-flex justify-content-between">
                              <div>
                                <h5 className="text-white mb-1">12</h5>
                                <p className="mb-0 small">Active Models</p>
                              </div>
                              <div className="avatar bg-white bg-opacity-25">
                                <i className="bx bx-check-circle text-white" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="card bg-warning text-white">
                          <div className="card-body">
                            <div className="d-flex justify-content-between">
                              <div>
                                <h5 className="text-white mb-1">8</h5>
                                <p className="mb-0 small">Pending Review</p>
                              </div>
                              <div className="avatar bg-white bg-opacity-25">
                                <i className="bx bx-time text-white" />
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
