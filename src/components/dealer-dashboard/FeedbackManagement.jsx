import { useEffect, useState } from "react";
import { deleteFeedback, getAllFeedbacks, getFeedbackById, updateFeedback } from "../../services/feedbackService";
import { decodeJwt } from "../../utils/jwt";

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [totalResults, setTotalResults] = useState(0);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchFeedbacks = async () => {
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
        const response = await getAllFeedbacks(params);
        if (response?.data) {
          setFeedbacks(response.data.items || []);
          setTotalResults(response.data.totalResults || 0);
          setTotalPages(Math.ceil((response.data.totalResults || 0) / pageSize));
        }
      } catch (err) {
        console.error("Error loading feedbacks:", err);
        setError("Failed to load feedbacks. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, [currentPage, searchTerm, statusFilter, pageSize]);

  const loadFeedbacks = async () => {
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
      const response = await getAllFeedbacks(params);
      if (response?.data) {
        setFeedbacks(response.data.items || []);
        setTotalResults(response.data.totalResults || 0);
        setTotalPages(Math.ceil((response.data.totalResults || 0) / pageSize));
      }
    } catch (err) {
      console.error("Error loading feedbacks:", err);
      setError("Failed to load feedbacks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (feedback) => {
    try {
      const response = await getFeedbackById(feedback.id);
      if (response?.data) {
        setSelectedFeedback(response.data);
        setShowDetailModal(true);
      }
    } catch (err) {
      console.error("Error loading feedback detail:", err);
      setError("Failed to load feedback details.");
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      // PUT requires full feedback object
      const updatedFeedback = {
        customerId: selectedFeedback.customerId,
        dealerId: selectedFeedback.dealerId,
        content: selectedFeedback.content,
        status: newStatus,
      };

      await updateFeedback(selectedFeedback.id, updatedFeedback);
      setShowDetailModal(false);
      setSelectedFeedback(null);
      loadFeedbacks();

      // Show success message
      const alert = document.createElement("div");
      alert.className = "alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3";
      alert.style.zIndex = "9999";
      alert.innerHTML = `
        <i class="bx bx-check-circle me-2"></i>
        Feedback status updated successfully!
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `;
      document.body.appendChild(alert);
      setTimeout(() => alert.remove(), 3000);
    } catch (err) {
      console.error("Error updating feedback:", err);
      setError("Failed to update feedback status.");
    }
  };

  const handleDeleteClick = (feedback) => {
    setFeedbackToDelete(feedback);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteFeedback(feedbackToDelete.id);
      setShowDeleteModal(false);
      setFeedbackToDelete(null);
      loadFeedbacks();

      // Show success message
      const alert = document.createElement("div");
      alert.className = "alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3";
      alert.style.zIndex = "9999";
      alert.innerHTML = `
        <i class="bx bx-check-circle me-2"></i>
        Feedback deleted successfully!
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `;
      document.body.appendChild(alert);
      setTimeout(() => alert.remove(), 3000);
    } catch (err) {
      console.error("Error deleting feedback:", err);
      setError("Failed to delete feedback.");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "New":
        return "bg-label-primary";
      case "Reviewed":
        return "bg-label-info";
      case "Resolved":
        return "bg-label-success";
      default:
        return "bg-label-secondary";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
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
            <i className="bx bx-message-square-dots me-2"></i>
            Feedback Management
          </h4>
          <p className="text-muted mb-0">View and manage customer feedbacks</p>
        </div>
        <button className="btn btn-primary" onClick={loadFeedbacks} disabled={loading}>
          <i className="bx bx-refresh me-1"></i>
          Refresh
        </button>
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
                placeholder="Search by content..."
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
                <option value="New">New</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Resolved">Resolved</option>
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

      {/* Feedbacks Table */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Feedbacks List</h5>
          <span className="badge bg-label-primary">{totalResults} Total</span>
        </div>
        <div className="table-responsive text-nowrap">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading feedbacks...</p>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="text-center py-5">
              <i className="bx bx-message-square-x display-1 text-muted"></i>
              <p className="mt-3 text-muted">No feedbacks found</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Content</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="table-border-bottom-0">
                {feedbacks.map((feedback) => (
                  <tr key={feedback.id}>
                    <td>
                      <small className="text-muted">{feedback.customerId.substring(0, 8)}...</small>
                    </td>
                    <td>
                      <div style={{ maxWidth: "300px" }}>{feedback.content.length > 50 ? `${feedback.content.substring(0, 50)}...` : feedback.content}</div>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(feedback.status)}`}>{feedback.status}</span>
                    </td>
                    <td>
                      <small className="text-muted">{formatDate(feedback.createdAt)}</small>
                    </td>
                    <td>
                      <div className="dropdown">
                        <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                          <i className="bx bx-dots-vertical-rounded"></i>
                        </button>
                        <div className="dropdown-menu">
                          <button className="dropdown-item" onClick={() => handleViewDetail(feedback)}>
                            <i className="bx bx-show me-2"></i>
                            View Details
                          </button>
                          <button className="dropdown-item text-danger" onClick={() => handleDeleteClick(feedback)}>
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
      {showDetailModal && selectedFeedback && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bx bx-message-square-detail me-2"></i>
                  Feedback Details
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowDetailModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Feedback ID</label>
                    <p className="text-muted">{selectedFeedback.id}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Customer ID</label>
                    <p className="text-muted">{selectedFeedback.customerId}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Dealer ID</label>
                    <p className="text-muted">{selectedFeedback.dealerId}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Current Status</label>
                    <p>
                      <span className={`badge ${getStatusBadgeClass(selectedFeedback.status)}`}>{selectedFeedback.status}</span>
                    </p>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Content</label>
                    <div className="alert alert-secondary mb-0">{selectedFeedback.content}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Created At</label>
                    <p className="text-muted">{formatDate(selectedFeedback.createdAt)}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Updated At</label>
                    <p className="text-muted">{formatDate(selectedFeedback.updatedAt)}</p>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Update Status</label>
                    <div className="btn-group w-100" role="group">
                      <button
                        type="button"
                        className={`btn ${selectedFeedback.status === "New" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => handleUpdateStatus("New")}
                        disabled={selectedFeedback.status === "New"}
                      >
                        New
                      </button>
                      <button
                        type="button"
                        className={`btn ${selectedFeedback.status === "Reviewed" ? "btn-info" : "btn-outline-info"}`}
                        onClick={() => handleUpdateStatus("Reviewed")}
                        disabled={selectedFeedback.status === "Reviewed"}
                      >
                        Reviewed
                      </button>
                      <button
                        type="button"
                        className={`btn ${selectedFeedback.status === "Resolved" ? "btn-success" : "btn-outline-success"}`}
                        onClick={() => handleUpdateStatus("Resolved")}
                        disabled={selectedFeedback.status === "Resolved"}
                      >
                        Resolved
                      </button>
                    </div>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && feedbackToDelete && (
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
                <p>Are you sure you want to delete this feedback?</p>
                <div className="alert alert-warning">
                  <strong>Content:</strong> {feedbackToDelete.content}
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

export default FeedbackManagement;
