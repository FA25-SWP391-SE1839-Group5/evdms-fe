import { useEffect, useState } from "react";
import {
  getAllSalesOrders,
  getSalesOrderById,
  createSalesOrder,
  updateSalesOrder,
  deleteSalesOrder,
} from "../../services/salesOrderService";

const SalesOrderManagement = () => {
  const [salesOrders, setSalesOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

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
    quotationId: "",
    dealerId: "",
    userId: "",
    customerId: "",
    vehicleId: "",
    date: "",
    status: "Pending",
  });

  useEffect(() => {
    loadSalesOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, statusFilter]);

  const loadSalesOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        pageSize: pageSize,
        search: searchTerm,
        filters: statusFilter ? `status:${statusFilter}` : "",
      };

      const response = await getAllSalesOrders(params);

      if (response?.data) {
        setSalesOrders(response.data.items || []);
        setTotalResults(response.data.totalResults || 0);
        setTotalPages(Math.ceil((response.data.totalResults || 0) / pageSize));
      }
    } catch (err) {
      console.error("Error loading sales orders:", err);
      setError("Failed to load sales orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (order) => {
    try {
      const response = await getSalesOrderById(order.id);
      if (response?.data) {
        setSelectedOrder(response.data);
        setShowDetailModal(true);
      }
    } catch (err) {
      console.error("Error loading sales order detail:", err);
      setError("Failed to load sales order details.");
    }
  };

  const handleCreateClick = () => {
    setFormData({
      quotationId: "",
      dealerId: "",
      userId: "",
      customerId: "",
      vehicleId: "",
      date: "",
      status: "Pending",
    });
    setShowCreateModal(true);
  };

  const handleEditClick = async (order) => {
    try {
      const response = await getSalesOrderById(order.id);
      if (response?.data) {
        setSelectedOrder(response.data);
        setFormData({
          quotationId: response.data.quotationId,
          dealerId: response.data.dealerId,
          userId: response.data.userId,
          customerId: response.data.customerId,
          vehicleId: response.data.vehicleId,
          date: response.data.date ? response.data.date.substring(0, 16) : "",
          status: response.data.status,
        });
        setShowEditModal(true);
      }
    } catch (err) {
      console.error("Error loading sales order:", err);
      setError("Failed to load sales order data.");
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        date: new Date(formData.date).toISOString(),
      };
      await createSalesOrder(dataToSend);
      setShowCreateModal(false);
      loadSalesOrders();
      showSuccessAlert("Sales order created successfully!");
    } catch (err) {
      console.error("Error creating sales order:", err);
      setError("Failed to create sales order.");
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        quotationId: formData.quotationId,
        dealerId: formData.dealerId,
        userId: formData.userId,
        customerId: formData.customerId,
        vehicleId: formData.vehicleId,
        date: new Date(formData.date).toISOString(),
        status: formData.status,
      };
      await updateSalesOrder(selectedOrder.id, dataToSend);
      setShowEditModal(false);
      setSelectedOrder(null);
      loadSalesOrders();
      showSuccessAlert("Sales order updated successfully!");
    } catch (err) {
      console.error("Error updating sales order:", err);
      setError("Failed to update sales order.");
    }
  };

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteSalesOrder(orderToDelete.id);
      setShowDeleteModal(false);
      setOrderToDelete(null);
      loadSalesOrders();
      showSuccessAlert("Sales order deleted successfully!");
    } catch (err) {
      console.error("Error deleting sales order:", err);
      setError("Failed to delete sales order.");
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
      case "Pending":
        return "bg-label-warning";
      case "Confirmed":
        return "bg-label-info";
      case "Completed":
        return "bg-label-success";
      case "Cancelled":
        return "bg-label-danger";
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">
            <i className="bx bx-shopping-bag me-2"></i>
            Sales Order Management
          </h4>
          <p className="text-muted mb-0">Manage sales orders and quotations</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" onClick={handleCreateClick}>
            <i className="bx bx-plus me-1"></i>
            New Sales Order
          </button>
          <button className="btn btn-outline-primary" onClick={loadSalesOrders} disabled={loading}>
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
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
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

      {/* Sales Orders Table */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Sales Orders List</h5>
          <span className="badge bg-label-primary">{totalResults} Total</span>
        </div>
        <div className="table-responsive text-nowrap">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading sales orders...</p>
            </div>
          ) : salesOrders.length === 0 ? (
            <div className="text-center py-5">
              <i className="bx bx-shopping-bag display-1 text-muted"></i>
              <p className="mt-3 text-muted">No sales orders found</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Vehicle ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="table-border-bottom-0">
                {salesOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <small className="text-muted">{order.customerId.substring(0, 8)}...</small>
                    </td>
                    <td>
                      <small className="text-muted">{order.vehicleId.substring(0, 8)}...</small>
                    </td>
                    <td>
                      <small>{formatDate(order.date)}</small>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
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
                          <button className="dropdown-item" onClick={() => handleViewDetail(order)}>
                            <i className="bx bx-show me-2"></i>
                            View Details
                          </button>
                          <button className="dropdown-item" onClick={() => handleEditClick(order)}>
                            <i className="bx bx-edit me-2"></i>
                            Edit
                          </button>
                          <button className="dropdown-item text-danger" onClick={() => handleDeleteClick(order)}>
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
      {showDetailModal && selectedOrder && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bx bx-info-circle me-2"></i>
                  Sales Order Details
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowDetailModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Sales Order ID</label>
                    <p className="text-muted">{selectedOrder.id}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Status</label>
                    <p>
                      <span className={`badge ${getStatusBadgeClass(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Quotation ID</label>
                    <p className="text-muted">{selectedOrder.quotationId}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Dealer ID</label>
                    <p className="text-muted">{selectedOrder.dealerId}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">User ID</label>
                    <p className="text-muted">{selectedOrder.userId}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Customer ID</label>
                    <p className="text-muted">{selectedOrder.customerId}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Vehicle ID</label>
                    <p className="text-muted">{selectedOrder.vehicleId}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Order Date</label>
                    <p className="text-muted">{formatDate(selectedOrder.date)}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Created At</label>
                    <p className="text-muted">{formatDateTime(selectedOrder.createdAt)}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Updated At</label>
                    <p className="text-muted">{formatDateTime(selectedOrder.updatedAt)}</p>
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
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleCreateSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bx bx-plus me-2"></i>
                    Create New Sales Order
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Quotation ID *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.quotationId}
                        onChange={(e) => setFormData({ ...formData, quotationId: e.target.value })}
                        required
                        placeholder="Enter quotation ID (GUID)"
                      />
                    </div>
                    <div className="col-md-6">
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
                    <div className="col-md-6">
                      <label className="form-label">User ID *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.userId}
                        onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                        required
                        placeholder="Enter user ID (GUID)"
                      />
                    </div>
                    <div className="col-md-6">
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
                    <div className="col-md-6">
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
                    <div className="col-md-6">
                      <label className="form-label">Order Date *</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label">Status *</label>
                      <select
                        className="form-select"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        required
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
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
      {showEditModal && selectedOrder && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleUpdateSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bx bx-edit me-2"></i>
                    Edit Sales Order
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Quotation ID *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.quotationId}
                        onChange={(e) => setFormData({ ...formData, quotationId: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Dealer ID *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.dealerId}
                        onChange={(e) => setFormData({ ...formData, dealerId: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">User ID *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.userId}
                        onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Customer ID *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.customerId}
                        onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Vehicle ID *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.vehicleId}
                        onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Order Date *</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label">Status *</label>
                      <select
                        className="form-select"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        required
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
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
      {showDeleteModal && orderToDelete && (
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
                <p>Are you sure you want to delete this sales order?</p>
                <div className="alert alert-warning">
                  <strong>Sales Order ID:</strong> {orderToDelete.id}
                  <br />
                  <strong>Customer ID:</strong> {orderToDelete.customerId}
                  <br />
                  <strong>Date:</strong> {formatDate(orderToDelete.date)}
                  <br />
                  <strong>Status:</strong> {orderToDelete.status}
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

export default SalesOrderManagement;
