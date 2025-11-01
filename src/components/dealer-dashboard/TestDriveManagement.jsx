import { useEffect, useState } from "react";
import {
  getAllTestDrives,
  getTestDriveById,
  createTestDrive,
  updateTestDrive,
  deleteTestDrive,
} from "../../services/testDriveService";

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
    dealerId: "",
    vehicleId: "",
    scheduledAt: "",
    status: "Scheduled",
  });

  useEffect(() => {
    loadTestDrives();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, statusFilter]);

  const loadTestDrives = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        pageSize: pageSize,
        search: searchTerm,
        filters: statusFilter ? `status:${statusFilter}` : "",
      };

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
      if (response?.data) {
        setSelectedTestDrive(response.data);
        setShowDetailModal(true);
      }
    } catch (err) {
      console.error("Error loading test drive detail:", err);
      setError("Failed to load test drive details.");
    }
  };

  const handleCreateClick = () => {
    setFormData({
      customerId: "",
      dealerId: "",
      vehicleId: "",
      scheduledAt: "",
      status: "Scheduled",
    });
    setShowCreateModal(true);
  };

  const handleEditClick = async (testDrive) => {
    try {
      const response = await getTestDriveById(testDrive.id);
      if (response?.data) {
        setSelectedTestDrive(response.data);
        setFormData({
          customerId: response.data.customerId,
          dealerId: response.data.dealerId,
          vehicleId: response.data.vehicleId,
          scheduledAt: response.data.scheduledAt ? response.data.scheduledAt.substring(0, 16) : "",
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
      const dataToSend = {
        ...formData,
        scheduledAt: new Date(formData.scheduledAt).toISOString(),
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
      await updateTestDrive(selectedTestDrive.id, dataToSend);
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
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
                  <th>Customer ID</th>
                  <th>Vehicle ID</th>
                  <th>Scheduled At</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="table-border-bottom-0">
                {testDrives.map((testDrive) => (
                  <tr key={testDrive.id}>
                    <td>
                      <small className="text-muted">{testDrive.customerId.substring(0, 8)}...</small>
                    </td>
                    <td>
                      <small className="text-muted">{testDrive.vehicleId.substring(0, 8)}...</small>
                    </td>
                    <td>
                      <small>{formatDateTime(testDrive.scheduledAt)}</small>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(testDrive.status)}`}>
                        {testDrive.status}
                      </span>
                    </td>
                    <td>
                      <div className="dropdown">
                        <button
                          type="button"
                          className="btn p-0 dropdown-toggle hide-arrow"
                          data-bs-toggle="dropdown"
                        >
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
                      <span className={`badge ${getStatusBadgeClass(selectedTestDrive.status)}`}>
                        {selectedTestDrive.status}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Customer ID</label>
                    <p className="text-muted">{selectedTestDrive.customerId}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Dealer ID</label>
                    <p className="text-muted">{selectedTestDrive.dealerId}</p>
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
                    <label className="form-label">Customer ID *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.customerId}
                      onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                      required
                      placeholder="Enter customer ID (GUID)"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Dealer ID *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.dealerId}
                      onChange={(e) => setFormData({ ...formData, dealerId: e.target.value })}
                      required
                      placeholder="Enter dealer ID (GUID)"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Vehicle ID *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.vehicleId}
                      onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                      required
                      placeholder="Enter vehicle ID (GUID)"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Scheduled At *</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={formData.scheduledAt}
                      onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status *</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      required
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="InProgress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
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
                    <label className="form-label">Customer ID *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.customerId}
                      onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Dealer ID *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.dealerId}
                      onChange={(e) => setFormData({ ...formData, dealerId: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Vehicle ID *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.vehicleId}
                      onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Scheduled At *</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={formData.scheduledAt}
                      onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status *</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      required
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="InProgress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
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
