import { useEffect, useState } from "react";
import { createTestDrive, deleteTestDrive, getAllTestDrives, getTestDriveById, patchTestDrive } from "../../services/testDriveService";
import { getCustomerById, getDealerById } from "../../services/dashboardService";
import { decodeJwt } from "../../utils/jwt";

const TestDriveManagement = () => {
  const [testDrives, setTestDrives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTestDrive, setSelectedTestDrive] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [testDriveToDelete, setTestDriveToDelete] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [totalResults, setTotalResults] = useState(0);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    customerId: "",
    vehicleId: "",
    scheduledAt: "",
  });

  // Dropdown options
  const [customerOptions, setCustomerOptions] = useState([]);
  const [vehicleOptions, setVehicleOptions] = useState([]);
  // Fetch customers and vehicles for dropdowns when modal opens
  const fetchDropdownOptions = async () => {
    try {
      const token = localStorage.getItem("evdms_auth_token");
      let dealerId;
      if (token) {
        const payload = decodeJwt(token);
        dealerId = payload?.dealerId;
      }
      // Fetch customers of the dealer
      let customers = [];
      if (dealerId) {
        const customerRes = await import("../../services/dashboardService").then((m) => m.getAllCustomers());
        customers = customerRes?.data?.items || [];
      }
      setCustomerOptions(customers);

      // Fetch vehicles of the dealer that are status=available and type=demo
      let vehicles = [];
      if (dealerId) {
        const vehicleRes = await import("../../services/vehicleService").then((m) => m.getAllVehicles({ filters: JSON.stringify({ dealerId, status: "available", type: "demo" }) }));
        console.log("Full vehicle API response:", vehicleRes);
        vehicles = vehicleRes?.data?.data?.items || [];
      }
      setVehicleOptions(vehicles);
      console.log("Vehicle options for dropdown:", vehicles);

      // Fetch variant names for vehicles
      if (vehicles.length > 0) {
        const variantIds = Array.from(new Set(vehicles.map((v) => v.variantId).filter(Boolean)));
        const variantMap = {};
        if (variantIds.length > 0) {
          const { getVehicleVariantById } = await import("../../services/vehicleVariantService");
          await Promise.all(
            variantIds.map(async (id) => {
              try {
                const res = await getVehicleVariantById(id);
                const variant = res?.data ?? res;
                variantMap[id] = variant.name || variant.variantName || variant.title || id;
              } catch {
                variantMap[id] = id;
              }
            })
          );
        }
      }
    } catch {
      setCustomerOptions([]);
      setVehicleOptions([]);
    }
  };

  useEffect(() => {
    loadTestDrives();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, statusFilter]);

  const loadTestDrives = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get dealerId from JWT
      const token = localStorage.getItem("evdms_auth_token");
      let dealerId;
      if (token) {
        const payload = decodeJwt(token);
        dealerId = payload?.dealerId;
      }
      const params = {
        page: currentPage,
        pageSize: pageSize,
        search: searchTerm,
      };
      // Always filter by dealerId
      if (dealerId) {
        params.filters = JSON.stringify({ dealerId });
      }
      // Attach status filter if provided
      if (statusFilter) {
        const extraFilter = { status: statusFilter };
        params.filters = params.filters ? JSON.stringify({ ...JSON.parse(params.filters), ...extraFilter }) : JSON.stringify(extraFilter);
      }
      const response = await getAllTestDrives(params);
      if (response?.data) {
        setTestDrives(response.data.items || []);
        setTotalResults(response.data.totalResults || 0);
        setTotalPages(Math.ceil((response.data.totalResults || 0) / pageSize));
      }
    } catch (err) {
      console.error("Error loading test drives:", err);
      setError("Failed to load test drives. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (testDrive) => {
    try {
      const response = await getTestDriveById(testDrive.id);
      if (response) {
        const data = response?.data ?? response;

        // fetch customer and dealer names in parallel, but don't block modal if they fail
        let customerName = null;
        let dealerName = null;
        try {
          const [custResp, dealerResp] = await Promise.all([
            getCustomerById(data.customerId),
            getDealerById(data.dealerId),
          ]);
          // normalize possible shapes
          const cust = custResp?.data ?? custResp;
          const dealer = dealerResp?.data ?? dealerResp;
          customerName = cust?.fullName || cust?.name || cust?.customerFullName || null;
          dealerName = dealer?.fullName || dealer?.name || dealer?.dealerName || dealer?.dealerFullName || null;
        } catch (e) {
          // ignore lookup errors, we'll fallback to IDs in the UI
          console.debug('Customer/Dealer lookup failed', e);
        }

        const enhanced = {
          ...data,
          customerFullName: customerName || data.customerFullName || data.customerName || null,
          dealerName: dealerName || data.dealerName || data.dealerFullName || null,
        };

        setSelectedTestDrive(enhanced);
        setShowDetailModal(true);
      }
    } catch (err) {
      console.error("Error loading test drive detail:", err);
      setError("Failed to load test drive details.");
    }
  };

  const handleCreateClick = async () => {
    setFormData({
      customerId: "",
      vehicleId: "",
      scheduledAt: "",
    });
    await fetchDropdownOptions();
    setShowCreateModal(true);
  };

  const handleEditClick = async (testDrive) => {
    try {
      const response = await getTestDriveById(testDrive.id);
      if (response?.data) {
        setSelectedTestDrive(response.data);
        // Convert UTC to local time for input value
        let localDateTime = "";
        if (response.data.scheduledAt) {
          const utcDate = new Date(response.data.scheduledAt);
          // Get local ISO string without seconds/milliseconds
          const pad = (n) => n.toString().padStart(2, "0");
          const year = utcDate.getFullYear();
          const month = pad(utcDate.getMonth() + 1);
          const day = pad(utcDate.getDate());
          const hour = pad(utcDate.getHours());
          const minute = pad(utcDate.getMinutes());
          localDateTime = `${year}-${month}-${day}T${hour}:${minute}`;
        }
        setFormData({
          scheduledAt: localDateTime,
          status: response.data.status,
        });
        setShowEditModal(true);
      }
    } catch (err) {
      console.error("Error loading test drive:", err);
      setError("Failed to load test drive data.");
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get dealerId from JWT
      const token = localStorage.getItem("evdms_auth_token");
      let dealerId;
      if (token) {
        const payload = decodeJwt(token);
        dealerId = payload?.dealerId;
      }
      const dataToSend = {
        ...formData,
        dealerId,
        scheduledAt: new Date(formData.scheduledAt).toISOString(),
        status: "Scheduled",
      };
      await createTestDrive(dataToSend);
      setShowCreateModal(false);
      loadTestDrives();
      showSuccessAlert("Test drive created successfully!");
    } catch (err) {
      console.error("Error creating test drive:", err);
      setError("Failed to create test drive.");
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        customerId: formData.customerId,
        dealerId: formData.dealerId,
        vehicleId: formData.vehicleId,
        scheduledAt: new Date(formData.scheduledAt).toISOString(),
        status: formData.status,
      };
      await patchTestDrive(selectedTestDrive.id, dataToSend);
      setShowEditModal(false);
      setSelectedTestDrive(null);
      loadTestDrives();
      showSuccessAlert("Test drive updated successfully!");
    } catch (err) {
      console.error("Error updating test drive:", err);
      setError("Failed to update test drive.");
    }
  };

  const handleDeleteClick = (testDrive) => {
    setTestDriveToDelete(testDrive);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTestDrive(testDriveToDelete.id);
      setShowDeleteModal(false);
      setTestDriveToDelete(null);
      loadTestDrives();
      showSuccessAlert("Test drive deleted successfully!");
    } catch (err) {
      console.error("Error deleting test drive:", err);
      setError("Failed to delete test drive.");
    }
  };

  const showSuccessAlert = (message) => {
    const alert = document.createElement("div");
    alert.className = "alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3";
    alert.style.zIndex = "9999";
    alert.innerHTML = `
      <i class="bx bx-check-circle me-2"></i>
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Scheduled":
        return "bg-label-primary";
      case "Completed":
        return "bg-label-success";
      case "Cancelled":
        return "bg-label-danger";
      case "InProgress":
        return "bg-label-info";
      default:
        return "bg-label-secondary";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    // Convert UTC string to local time
    const utcDate = new Date(dateString);
    // toLocaleString will show in user's local time zone
    return utcDate.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">
            <i className="bx bx-car me-2"></i>
            Test Drive Management
          </h4>
          <p className="text-muted mb-0">Manage test drive appointments</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" onClick={handleCreateClick}>
            <i className="bx bx-plus me-1"></i>
            New Test Drive
          </button>
          <button className="btn btn-outline-primary" onClick={loadTestDrives} disabled={loading}>
            <i className="bx bx-refresh me-1"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by customer, dealer, or vehicle ID..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Status Filter</label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Status</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="InProgress">In Progress</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bx bx-error me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {/* Test Drives Table */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Test Drives List</h5>
          <span className="badge bg-label-primary">{totalResults} Total</span>
        </div>
        <div className="table-responsive text-nowrap">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading test drives...</p>
            </div>
          ) : testDrives.length === 0 ? (
            <div className="text-center py-5">
              <i className="bx bx-car display-1 text-muted"></i>
              <p className="mt-3 text-muted">No test drives found</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>VIN</th>
                  <th>Scheduled At</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="table-border-bottom-0">
                {testDrives.map((testDrive) => (
                  <tr key={testDrive.id}>
                    <td>
                      <small className="text-muted">{testDrive.customerFullName || testDrive.customerId}</small>
                    </td>
                    <td>
                      <small className="text-muted">{testDrive.vehicleVin || testDrive.vehicleId}</small>
                    </td>
                    <td>
                      <small>{formatDateTime(testDrive.scheduledAt)}</small>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(testDrive.status)}`}>{testDrive.status}</span>
                    </td>
                    <td>
                      <div className="dropdown">
                        <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                          <i className="bx bx-dots-vertical-rounded"></i>
                        </button>
                        <div className="dropdown-menu">
                          <button className="dropdown-item" onClick={() => handleViewDetail(testDrive)}>
                            <i className="bx bx-show me-2"></i>
                            View Details
                          </button>
                          <button className="dropdown-item" onClick={() => handleEditClick(testDrive)}>
                            <i className="bx bx-edit me-2"></i>
                            Edit
                          </button>
                          <button className="dropdown-item text-danger" onClick={() => handleDeleteClick(testDrive)}>
                            <i className="bx bx-trash me-2"></i>
                            Delete
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="card-footer">
            <nav>
              <ul className="pagination pagination-sm justify-content-center mb-0">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                    <i className="tf-icon bx bx-chevron-left"></i>
                  </button>
                </li>
                {[...Array(totalPages)].map((_, index) => (
                  <li key={index + 1} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                    <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                    <i className="tf-icon bx bx-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedTestDrive && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bx bx-info-circle me-2"></i>
                  Test Drive Details
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowDetailModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Test Drive ID</label>
                    <p className="text-muted">{selectedTestDrive.id}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Status</label>
                    <p>
                      <span className={`badge ${getStatusBadgeClass(selectedTestDrive.status)}`}>{selectedTestDrive.status}</span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Customer Name</label>
                    <p className="text-muted">{selectedTestDrive.customerFullName || selectedTestDrive.customerName || selectedTestDrive.customerId}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Dealer Name</label>
                    <p className="text-muted">{selectedTestDrive.dealerName || selectedTestDrive.dealerFullName || selectedTestDrive.dealerId}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Vehicle ID</label>
                    <p className="text-muted">{selectedTestDrive.vehicleId}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Scheduled At</label>
                    <p className="text-muted">{formatDateTime(selectedTestDrive.scheduledAt)}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Created At</label>
                    <p className="text-muted">{formatDateTime(selectedTestDrive.createdAt)}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Updated At</label>
                    <p className="text-muted">{formatDateTime(selectedTestDrive.updatedAt)}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleCreateSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bx bx-plus me-2"></i>
                    Create New Test Drive
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Customer Name *</label>
                    <select className="form-select" value={formData.customerId} onChange={(e) => setFormData({ ...formData, customerId: e.target.value })} required>
                      <option value="">Select customer...</option>
                      {customerOptions.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.fullName || customer.name || customer.id}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Vehicle *</label>
                    <select className="form-select" value={formData.vehicleId} onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })} required>
                      <option value="">Select vehicle...</option>
                      {vehicleOptions.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {`${vehicle.variantName || vehicle.variantId} - ${vehicle.vin}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Scheduled At *</label>
                    <input type="datetime-local" className="form-control" value={formData.scheduledAt} onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })} required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="bx bx-check me-1"></i>
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedTestDrive && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleUpdateSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bx bx-edit me-2"></i>
                    Edit Test Drive
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Scheduled At *</label>
                    <input type="datetime-local" className="form-control" value={formData.scheduledAt} onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status *</label>
                    <select className="form-select" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} required>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Canceled">Canceled</option>
                      <option value="NoShow">NoShow</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="bx bx-save me-1"></i>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && testDriveToDelete && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bx bx-trash me-2"></i>
                  Confirm Delete
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this test drive?</p>
                <div className="alert alert-warning">
                  <strong>Test Drive ID:</strong> {testDriveToDelete.id}
                  <br />
                  <strong>Scheduled At:</strong> {formatDateTime(testDriveToDelete.scheduledAt)}
                  <br />
                  <strong>Status:</strong> {testDriveToDelete.status}
                </div>
                <p className="text-danger mb-0">
                  <i className="bx bx-error-circle me-1"></i>
                  This action cannot be undone.
                </p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm}>
                  <i className="bx bx-trash me-1"></i>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestDriveManagement;
