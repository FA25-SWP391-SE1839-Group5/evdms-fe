import { useEffect, useState } from "react";
import { getCurrentUser } from "../../services/authService";
import { createOrder, getAllCustomers } from "../../services/dashboardService";
import { createQuotation, deleteQuotation, getAllQuotations, getQuotationById, updateQuotation } from "../../services/quotationService";
import { getAllVehicleVariants } from "../../services/vehicleVariantService";
import { decodeJwt } from "../../utils/jwt";

const QuotationManagement = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quotationToDelete, setQuotationToDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  // API sample: { customerId, variantId, color }
  const [createForm, setCreateForm] = useState({ customerId: "", variantId: "", color: "", totalAmount: "", status: "Draft" });
  const [customers, setCustomers] = useState([]);
  const [variants, setVariants] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    const fetchQuotations = async () => {
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
          pageSize,
          search: searchTerm || undefined,
        };
        // Always filter by dealerId
        if (dealerId) {
          params.filters = JSON.stringify({ dealerId });
        }
        // Attach additional filter if provided
        if (filterBy && filterValue) {
          const extraFilter = { [filterBy]: filterValue };
          params.filters = params.filters ? JSON.stringify({ ...JSON.parse(params.filters), ...extraFilter }) : JSON.stringify(extraFilter);
        }
        const response = await getAllQuotations(params);
        let items = [];
        let total = 0;
        if (!response) {
          items = [];
        } else if (Array.isArray(response)) {
          items = response;
        } else if (Array.isArray(response.data)) {
          items = response.data;
        } else if (response.data && Array.isArray(response.data.items)) {
          items = response.data.items;
          total = response.data.totalResults || response.data.total || 0;
        } else if (response.items && Array.isArray(response.items)) {
          items = response.items;
          total = response.totalResults || response.total || 0;
        } else if (response.data && typeof response.data === "object") {
          const d = response.data;
          if (d.items && Array.isArray(d.items)) {
            items = d.items;
            total = d.totalResults || d.total || 0;
          } else if (Array.isArray(d)) {
            items = d;
          } else {
            items = [d];
          }
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          items = response.data.data;
        } else if (response.data?.data && typeof response.data.data === "object") {
          items = [response.data.data];
        } else {
          items = response?.data || response?.items || [];
          if (!Array.isArray(items)) items = [items];
        }
        setQuotations(items);
        setTotalResults(Number(total) || items.length || 0);
        setTotalPages(Math.max(1, Math.ceil((Number(total) || items.length) / pageSize)));
      } catch {
        setError("Failed to load quotations. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuotations();
  }, [currentPage, searchTerm, filterBy, filterValue, pageSize]);

  // Load customers and variants for dropdowns
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [custRes, varRes] = await Promise.all([getAllCustomers(), getAllVehicleVariants({ page: 1, pageSize: 1000 })]);

        // dashboardService returns { success, data } in some callers; handle different shapes
        const custItems = custRes?.data?.items || custRes?.data || custRes?.items || [];
        setCustomers(custItems);

        const varItems = varRes?.items || varRes?.data?.items || varRes?.data || [];
        setVariants(varItems);
      } catch (err) {
        console.error("Error loading customers/variants:", err);
      }
    };
    loadOptions();
  }, []);

  const loadQuotations = async () => {
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
        pageSize,
        search: searchTerm || undefined,
      };
      // Always filter by dealerId
      if (dealerId) {
        params.filters = JSON.stringify({ dealerId });
      }
      // Attach additional filter if provided
      if (filterBy && filterValue) {
        const extraFilter = { [filterBy]: filterValue };
        params.filters = params.filters ? JSON.stringify({ ...JSON.parse(params.filters), ...extraFilter }) : JSON.stringify(extraFilter);
      }
      const response = await getAllQuotations(params);
      let items = [];
      let total = 0;
      if (!response) {
        items = [];
      } else if (Array.isArray(response)) {
        items = response;
      } else if (Array.isArray(response.data)) {
        items = response.data;
      } else if (response.data && Array.isArray(response.data.items)) {
        items = response.data.items;
        total = response.data.totalResults || response.data.total || 0;
      } else if (response.items && Array.isArray(response.items)) {
        items = response.items;
        total = response.totalResults || response.total || 0;
      } else if (response.data && typeof response.data === "object") {
        const d = response.data;
        if (d.items && Array.isArray(d.items)) {
          items = d.items;
          total = d.totalResults || d.total || 0;
        } else if (Array.isArray(d)) {
          items = d;
        } else {
          items = [d];
        }
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        items = response.data.data;
      } else if (response.data?.data && typeof response.data.data === "object") {
        items = [response.data.data];
      } else {
        items = response?.data || response?.items || [];
        if (!Array.isArray(items)) items = [items];
      }
      setQuotations(items);
      setTotalResults(Number(total) || items.length || 0);
      setTotalPages(Math.max(1, Math.ceil((Number(total) || items.length) / pageSize)));
    } catch (err) {
      console.error("Error loading quotations:", err);
      setError("Failed to load quotations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getCustomerName = (id) => {
    if (!id) return "-";
    const c = customers.find((x) => x.id === id || x._id === id || x.customerId === id);
    return c ? c.fullName || c.name || c.email || id : id;
  };

  const getVariantName = (id) => {
    if (!id) return "-";
    const v = variants.find((x) => x.id === id || x._id === id || x.variantId === id);
    return v ? v.name || v.variantName || v.title || id : id;
  };

  const getStatusBadgeClass = (status) => {
    if (!status) return "bg-label-secondary";
    switch (String(status).toLowerCase()) {
      case "draft":
        return "bg-label-secondary";
      case "sent":
        return "bg-label-info";
      case "approved":
      case "approve":
        return "bg-label-success";
      case "rejected":
      case "cancelled":
        return "bg-label-danger";
      default:
        return "bg-label-secondary";
    }
  };

  const getColorBadgeClass = (color) => {
    if (!color) return "bg-label-secondary text-dark";
    const c = String(color).toLowerCase();
    if (c.includes("red")) return "bg-label-danger";
    if (c.includes("blue")) return "bg-label-primary";
    if (c.includes("green")) return "bg-label-success";
    if (c.includes("yellow")) return "bg-label-warning text-dark";
    if (c.includes("silver") || c.includes("gray") || c.includes("grey")) return "bg-label-secondary";
    if (c.includes("black")) return "bg-label-secondary";
    if (c.includes("white")) return "bg-label-light text-dark";
    return "bg-label-secondary";
  };

  const handleViewDetail = async (q) => {
    try {
      const response = await getQuotationById(q.id);
      if (response?.data) {
        setSelectedQuotation(response.data);
        setShowDetailModal(true);
        setIsEditing(false);
        setEditForm(null);
      }
    } catch (err) {
      console.error("Error loading quotation detail:", err);
      setError("Failed to load quotation details.");
    }
  };

  const handleDeleteClick = (q) => {
    setQuotationToDelete(q);
    setShowDeleteModal(true);
  };

  const handleOpenCreate = () => {
    setCreateForm({ customerId: "", variantId: "", color: "", totalAmount: "", status: "Draft" });
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Build DTO: dealerId, userId, customerId, variantId, color, totalAmount, status
      const currentUser = getCurrentUser();
      const token = localStorage.getItem("evdms_auth_token");
      const decoded = decodeJwt(token);
      const dealerId = decoded?.dealerId || decoded?.dealer || "";
      const userId = currentUser?.id || decoded?.sub || "";

      const dto = {
        dealerId,
        userId,
        customerId: createForm.customerId,
        variantId: createForm.variantId,
        color: createForm.color,
        totalAmount: Number(createForm.totalAmount) || 0,
        status: createForm.status || "Draft",
      };

      await createQuotation(dto);
      setShowCreateModal(false);
      setCreateForm({ customerId: "", variantId: "", color: "", totalAmount: "", status: "Draft" });
      loadQuotations();
      const alert = document.createElement("div");
      alert.className = "alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3";
      alert.style.zIndex = "9999";
      alert.innerHTML = `
        <i class="bx bx-check-circle me-2"></i>
        Quotation created successfully!
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `;
      document.body.appendChild(alert);
      setTimeout(() => alert.remove(), 3000);
    } catch (err) {
      console.error("Error creating quotation:", err);
      setError("Failed to create quotation.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (!selectedQuotation) return;
    if (!isEditing) {
      setEditForm({ ...selectedQuotation, totalAmount: selectedQuotation.totalAmount || "" });
      setIsEditing(true);
    } else {
      setIsEditing(false);
      setEditForm(null);
    }
  };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      // Send the updated fields expected by the API per UpdateQuotationDto
      const currentUser = getCurrentUser();
      const token = localStorage.getItem("evdms_auth_token");
      const decoded = decodeJwt(token);
      const dealerId = decoded?.dealerId || decoded?.dealer || "";
      const userId = currentUser?.id || decoded?.sub || "";

      const payload = {
        dealerId,
        userId,
        customerId: editForm.customerId,
        variantId: editForm.variantId,
        color: editForm.color,
        totalAmount: Number(editForm.totalAmount) || 0,
        status: editForm.status || "Draft",
      };
      // include id if backend requires it in body; otherwise it's in URL
      await updateQuotation(editForm.id, payload);
      setIsEditing(false);
      setEditForm(null);
      setShowDetailModal(false);
      setSelectedQuotation(null);
      loadQuotations();
      const alert = document.createElement("div");
      alert.className = "alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3";
      alert.style.zIndex = "9999";
      alert.innerHTML = `
        <i class="bx bx-check-circle me-2"></i>
        Quotation updated successfully!
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `;
      document.body.appendChild(alert);
      setTimeout(() => alert.remove(), 3000);
    } catch (err) {
      console.error("Error updating quotation:", err);
      setError("Failed to update quotation.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteQuotation(quotationToDelete.id);
      setShowDeleteModal(false);
      setQuotationToDelete(null);
      loadQuotations();

      const alert = document.createElement("div");
      alert.className = "alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3";
      alert.style.zIndex = "9999";
      alert.innerHTML = `
        <i class="bx bx-check-circle me-2"></i>
        Quotation deleted successfully!
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `;
      document.body.appendChild(alert);
      setTimeout(() => alert.remove(), 3000);
    } catch (err) {
      console.error("Error deleting quotation:", err);
      setError("Failed to delete quotation.");
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      if (!selectedQuotation) return;
      const currentUser = getCurrentUser();
      const token = localStorage.getItem("evdms_auth_token");
      const decoded = decodeJwt(token);
      const dealerId = decoded?.dealerId || decoded?.dealer || "";
      const userId = currentUser?.id || decoded?.sub || "";

      const payload = {
        dealerId,
        userId,
        customerId: selectedQuotation.customerId,
        variantId: selectedQuotation.variantId,
        color: selectedQuotation.color,
        totalAmount: Number(selectedQuotation.totalAmount) || 0,
        status: newStatus,
      };

      await updateQuotation(selectedQuotation.id, payload);
      setShowDetailModal(false);
      setSelectedQuotation(null);
      loadQuotations();

      // If the status is changed to Approved (or Approve), create a sales order
      if (newStatus === "Approved" || newStatus === "Approve") {
        try {
          // Minimal payload: include the quotation id so backend can create order from it
          const orderPayload = { quotationId: selectedQuotation.id };
          await createOrder(orderPayload);

          const orderAlert = document.createElement("div");
          orderAlert.className = "alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3";
          orderAlert.style.zIndex = "9999";
          orderAlert.innerHTML = `
            <i class="bx bx-check-circle me-2"></i>
            Sales order created from quotation!
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
          `;
          document.body.appendChild(orderAlert);
          setTimeout(() => orderAlert.remove(), 3000);
        } catch (orderErr) {
          console.error("Error creating order from quotation:", orderErr);
          // If error message matches, revert status to Sent
          const msg = orderErr?.response?.data?.message || orderErr?.message || "";
          const failAlert = document.createElement("div");
          failAlert.className = "alert alert-warning alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3";
          failAlert.style.zIndex = "9999";
          failAlert.innerHTML = `
            <i class="bx bx-error me-2"></i>
            No available vehicle for sale matching the quotation's variant and color.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
          `;
          document.body.appendChild(failAlert);
          setTimeout(() => failAlert.remove(), 5000);
          // Revert status to Sent in backend
          try {
            await updateQuotation(selectedQuotation.id, { ...payload, status: "Sent" });
            loadQuotations();
          } catch (revertErr) {
            console.error("Error reverting status to Sent:", revertErr);
          }
          return;
        }
      }

      const alert = document.createElement("div");
      alert.className = "alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3";
      alert.style.zIndex = "9999";
      alert.innerHTML = `
        <i class="bx bx-check-circle me-2"></i>
        Quotation status updated successfully!
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `;
      document.body.appendChild(alert);
      setTimeout(() => alert.remove(), 3000);
    } catch (err) {
      console.error("Error updating quotation:", err);
      setError("Failed to update quotation status.");
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
            <i className="bx bx-file me-2 text-primary"></i>
            Quotation Management
          </h4>
          <p className="text-muted mb-0">View and manage quotations</p>
        </div>
        <div className="d-flex align-items-center">
          <button className="btn btn-outline-primary me-2" onClick={handleOpenCreate}>
            <i className="bx bx-plus me-1"></i>
            New Quotation
          </button>
          <button className="btn btn-primary" onClick={loadQuotations} disabled={loading}>
            <i className="bx bx-refresh me-1"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by customer, quote id or color"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Filter by</label>
              <select
                className="form-select"
                value={filterBy}
                onChange={(e) => {
                  setFilterBy(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">None</option>
                <option value="variantId">Variant ID</option>
                <option value="status">Status</option>
                <option value="color">Color</option>
                <option value="customerId">Customer ID</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Filter value</label>
              <input
                type="text"
                className="form-control"
                placeholder="Value"
                value={filterValue}
                onChange={(e) => {
                  setFilterValue(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Page size</label>
              <select
                className="form-select"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                {[5, 10, 20, 50, 100].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 mt-2 d-flex justify-content-end">
              <button
                className="btn btn-outline-secondary me-2"
                onClick={() => {
                  setSearchTerm("");
                  setFilterBy("");
                  setFilterValue("");
                  setPageSize(10);
                  setCurrentPage(1);
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bx bx-error me-2" />
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={handleCreateSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bx bx-plus me-2"></i>Create Quotation
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Customer</label>
                  <select className="form-select" value={createForm.customerId} onChange={(e) => setCreateForm({ ...createForm, customerId: e.target.value })} required>
                    <option value="">Select customer</option>
                    {customers.map((c) => (
                      <option key={c.id || c._id || c.customerId} value={c.id || c._id || c.customerId}>
                        {c.fullName || c.name || c.email || c.id || c._id || c.customerId}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Variant</label>
                  <select className="form-select" value={createForm.variantId} onChange={(e) => setCreateForm({ ...createForm, variantId: e.target.value })} required>
                    <option value="">Select variant</option>
                    {variants.map((v) => (
                      <option key={v.id || v._id || v.variantId} value={v.id || v._id || v.variantId}>
                        {v.name || v.variantName || v.title || v.id || v._id || v.variantId}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Color</label>
                  <select className="form-select" value={createForm.color} onChange={(e) => setCreateForm({ ...createForm, color: e.target.value })}>
                    <option value="">Select color</option>
                    {["Red", "Blue", "Black", "White", "Silver", "Gray", "Green", "Yellow"].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Quotations List</h5>
          <span className="badge bg-label-primary">{totalResults} Total</span>
        </div>
        <div className="table-responsive text-nowrap">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading quotations...</p>
            </div>
          ) : quotations.length === 0 ? (
            <div className="text-center py-5">
              <i className="bx bx-file display-1 text-muted"></i>
              <p className="mt-3 text-muted">No quotations found</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Variant</th>
                  <th>Color</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="table-border-bottom-0">
                {quotations.map((q) => {
                  const id = q.id || q._id || q.quotationId || q.quoteId;
                  return (
                    <tr key={id}>
                      <td>
                        <small className="text-muted">{getCustomerName(q.customerId)}</small>
                      </td>
                      <td>
                        <small className="text-muted">{getVariantName(q.variantId)}</small>
                      </td>
                      <td>{q.color ? <span className={`badge ${getColorBadgeClass(q.color)}`}>{q.color}</span> : <small className="text-muted">-</small>}</td>
                      <td>{q.status ? <span className={`badge ${getStatusBadgeClass(q.status)}`}>{q.status}</span> : <small className="text-muted">-</small>}</td>
                      <td>
                        <small className="text-muted">{formatDate(q.createdAt)}</small>
                      </td>
                      <td>
                        <div className="dropdown">
                          <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                            <i className="bx bx-dots-vertical-rounded"></i>
                          </button>
                          <div className="dropdown-menu">
                            <button className="dropdown-item" onClick={() => handleViewDetail(q)}>
                              <i className="bx bx-show me-2"></i>
                              View Details
                            </button>
                            <button className="dropdown-item text-danger" onClick={() => handleDeleteClick(q)}>
                              <i className="bx bx-trash me-2"></i>
                              Delete
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
      {showDetailModal && selectedQuotation && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bx bx-file me-2"></i>
                  Quotation Details
                </h5>
                <div className="d-flex align-items-center">
                  <button type="button" className="btn btn-outline-secondary me-2" onClick={handleEditToggle}>
                    {isEditing ? (
                      <>
                        <i className="bx bx-x me-1"></i> Cancel
                      </>
                    ) : (
                      <>
                        <i className="bx bx-edit me-1"></i> Edit
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowDetailModal(false);
                      setIsEditing(false);
                      setEditForm(null);
                    }}
                  ></button>
                </div>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Quotation ID</label>
                    {isEditing ? <input className="form-control" value={editForm?.id || selectedQuotation.id} disabled /> : <p className="text-muted">{selectedQuotation.id || "-"}</p>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Customer</label>
                    {isEditing ? (
                      <select className="form-select" value={editForm?.customerId || selectedQuotation.customerId} onChange={(e) => setEditForm({ ...editForm, customerId: e.target.value })}>
                        <option value="">Select customer</option>
                        {customers.map((c) => (
                          <option key={c.id || c._id || c.customerId} value={c.id || c._id || c.customerId}>
                            {c.fullName || c.name || c.email || c.id || c._id || c.customerId}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-muted">{getCustomerName(selectedQuotation.customerId)}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Variant</label>
                    {isEditing ? (
                      <select className="form-select" value={editForm?.variantId || selectedQuotation.variantId} onChange={(e) => setEditForm({ ...editForm, variantId: e.target.value })}>
                        <option value="">Select variant</option>
                        {variants.map((v) => (
                          <option key={v.id || v._id || v.variantId} value={v.id || v._id || v.variantId}>
                            {v.name || v.variantName || v.title || v.id || v._id || v.variantId}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-muted">{getVariantName(selectedQuotation.variantId)}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Color</label>
                    <p>
                      {isEditing ? (
                        <select className="form-select" value={editForm?.color || selectedQuotation.color || ""} onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}>
                          <option value="">Select color</option>
                          {["Red", "Blue", "Black", "White", "Silver", "Gray", "Green", "Yellow"].map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      ) : selectedQuotation.color ? (
                        <span className={`badge ${getColorBadgeClass(selectedQuotation.color)}`}>{selectedQuotation.color}</span>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Total Amount</label>
                    <p className="text-muted">{selectedQuotation.totalAmount != null ? selectedQuotation.totalAmount : "-"}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Status</label>
                    {isEditing ? (
                      <select className="form-select" value={editForm?.status || selectedQuotation.status || "Draft"} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                        {["Draft", "Sent", "Approved", "Rejected"].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    ) : selectedQuotation.status ? (
                      <span className={`badge ${getStatusBadgeClass(selectedQuotation.status)}`}>{selectedQuotation.status}</span>
                    ) : (
                      <p className="text-muted">-</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Created At</label>
                    <p className="text-muted">{formatDate(selectedQuotation.createdAt)}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Updated At</label>
                    <p className="text-muted">{formatDate(selectedQuotation.updatedAt)}</p>
                  </div>

                  <div className="col-12">
                    {isEditing ? (
                      <div className="d-flex justify-content-end">
                        <button type="button" className="btn btn-outline-secondary me-2" onClick={handleEditToggle}>
                          Cancel
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleSaveEdit}>
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="btn-group w-100" role="group">
                        <button
                          type="button"
                          className={`btn ${selectedQuotation.status === "Sent" ? "btn-info" : "btn-outline-info"}`}
                          onClick={() => handleUpdateStatus("Sent")}
                          disabled={selectedQuotation.status === "Sent"}
                        >
                          Send
                        </button>
                        <button
                          type="button"
                          className={`btn ${selectedQuotation.status === "Approved" ? "btn-success" : "btn-outline-success"}`}
                          onClick={() => handleUpdateStatus("Approved")}
                          disabled={selectedQuotation.status === "Approved"}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className={`btn ${selectedQuotation.status === "Rejected" ? "btn-danger" : "btn-outline-danger"}`}
                          onClick={() => handleUpdateStatus("Rejected")}
                          disabled={selectedQuotation.status === "Rejected"}
                        >
                          Reject
                        </button>
                      </div>
                    )}
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
      {showDeleteModal && quotationToDelete && (
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
                <p>Are you sure you want to delete this quotation?</p>
                <div className="alert alert-warning">
                  <strong>Quotation ID:</strong> {quotationToDelete.id}
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

export default QuotationManagement;
