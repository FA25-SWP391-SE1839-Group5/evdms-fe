import { useEffect, useState } from "react";
import { createCustomer, deleteCustomer, exportCustomers, getAllCustomers, updateCustomer } from "../../services/dashboardService";

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", address: "" });

  // Pagination, search, sort
  const [exporting, setExporting] = useState(false);
  // Export handler
  const handleExport = async () => {
    setExporting(true);
    setError(null);
    try {
      const response = await exportCustomers();
      // Get filename from Content-Disposition header
      let filename = "customers.csv";
      const disposition = response.headers?.["content-disposition"] || response.headers?.get?.("content-disposition");
      if (disposition) {
        const match = disposition.match(/filename="?([^";]+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }
      // Download the CSV file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError("Export failed: " + (err.message || "Unknown error"));
    } finally {
      setExporting(false);
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Debounce only searchTerm
  useEffect(() => {
    const handler = setTimeout(() => {
      loadCustomers();
    }, 350);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // Immediate load for page, pageSize, sort
  useEffect(() => {
    loadCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, sortBy, sortOrder]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        pageSize,
        search: searchTerm || undefined,
        sortBy: sortBy || undefined,
        sortOrder: sortOrder || undefined,
      };

      // ...existing code...

      // Debug: log params so you can inspect the exact outgoing query in browser console/network
      // Remove or lower verbosity in production
      console.debug("Customer list params:", params);

      const resp = await getAllCustomers(params);
      const items = resp?.data?.items || resp?.items || resp?.data || [];
      setCustomers(items);
      setTotalResults(resp?.data?.totalResults ?? resp?.totalResults ?? items.length);
    } catch (err) {
      console.error("Error loading customers:", err);
      setError("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setForm({ fullName: "", email: "", phone: "", address: "" });
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const resp = await createCustomer(form);
      // If API returns success false, show its message
      if (resp && resp.success === false && resp.message) {
        setError(resp.message);
        return;
      }
      setShowCreateModal(false);
      loadCustomers();
      showSuccessAlert("Customer created successfully!");
    } catch (err) {
      console.error("Error creating customer:", err);
      // Try to extract message from error response
      let apiMsg = err?.response?.data?.message || err?.message;
      setError(apiMsg || "Failed to create customer.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (c) => {
    setSelectedCustomer(c);
    setForm({ fullName: c.fullName || "", email: c.email || "", phone: c.phone || "", address: c.address || "" });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    try {
      setLoading(true);
      const resp = await updateCustomer(selectedCustomer.id || selectedCustomer._id, form);
      if (resp && resp.success === false && resp.message) {
        setError(resp.message);
        return;
      }
      setShowEditModal(false);
      setSelectedCustomer(null);
      loadCustomers();
      showSuccessAlert("Customer updated successfully!");
    } catch (err) {
      console.error("Error updating customer:", err);
      let apiMsg = err?.response?.data?.message || err?.message;
      setError(apiMsg || "Failed to update customer.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (c) => {
    if (!window.confirm("Delete this customer?")) return;
    try {
      setLoading(true);
      await deleteCustomer(c.id || c._id);
      loadCustomers();
      showSuccessAlert("Customer deleted.");
    } catch (err) {
      console.error("Error deleting customer:", err);
      setError("Failed to delete customer.");
    } finally {
      setLoading(false);
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

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));

  // Helper for copying to clipboard
  const handleCopyId = (id) => {
    if (!id) return;
    navigator.clipboard.writeText(id.toString());
    showSuccessAlert("ID copied to clipboard!");
  };

  // No need for hoveredId state when using native tooltip

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">
            <i className="bx bx-user me-2 text-primary"></i>
            Customer Management
          </h4>
          <p className="text-muted mb-0">Manage customers</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <i className="bx bx-plus me-1" /> New Customer
          </button>
          <button className="btn btn-primary" onClick={loadCustomers} disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> : <i className="bx bx-refresh me-1"></i>}
            Refresh
          </button>
          <button className="btn btn-success" onClick={handleExport} disabled={exporting}>
            {exporting ? <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> : <i className="bx bx-export me-1"></i>}
            Export CSV
          </button>
        </div>
      </div>

      {/* Controls: search, pageSize */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2 align-items-center">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search name/email/address..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
            <div className="col-md-4 text-end">
              <button
                className="btn btn-outline-secondary"
                onClick={() => {
                  setSearchTerm("");
                  setSortBy("");
                  setSortOrder("asc");
                  setCurrentPage(1);
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Only show error in modal, not here */}

      <div className="card">
        <div className="table-responsive text-nowrap">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading customers...</p>
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-5">
              <i className="bx bx-user display-1 text-muted"></i>
              <p className="mt-3 text-muted">No customers found</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th onClick={() => toggleSort("id")} style={{ cursor: "pointer" }}>
                    ID {sortBy === "id" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                  </th>
                  <th onClick={() => toggleSort("fullName")} style={{ cursor: "pointer" }}>
                    Name {sortBy === "fullName" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                  </th>
                  <th onClick={() => toggleSort("email")} style={{ cursor: "pointer" }}>
                    Email {sortBy === "email" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                  </th>
                  <th onClick={() => toggleSort("address")} style={{ cursor: "pointer" }}>
                    Address {sortBy === "address" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                  </th>
                  <th onClick={() => toggleSort("phone")} style={{ cursor: "pointer" }}>
                    Phone {sortBy === "phone" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="table-border-bottom-0">
                {customers.map((c) => (
                  <tr key={c.id || c._id}>
                    <td>
                      <small className="text-muted" style={{ cursor: "pointer" }} title={c.id || c._id} onClick={() => handleCopyId(c.id || c._id)}>
                        {(c.id || c._id)?.toString().substring(0, 8)}...
                      </small>
                    </td>
                    <td>{c.fullName || c.name || "-"}</td>
                    <td>{c.email || "-"}</td>
                    <td>{c.address || "-"}</td>
                    <td>{c.phone || "-"}</td>
                    <td>
                      <div className="btn-group">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditClick(c)}>
                          <i className="bx bx-edit me-1" /> Edit
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c)}>
                          <i className="bx bx-trash me-1" /> Delete
                        </button>
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

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={handleCreateSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">Create Customer</h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)} />
              </div>
              <div className="modal-body">
                {/* Error message inside modal */}
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bx bx-error me-2" />
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input className="form-control" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input className="form-control" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input className="form-control" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
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

      {/* Edit Modal */}
      {showEditModal && selectedCustomer && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={handleEditSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">Edit Customer</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)} />
              </div>
              <div className="modal-body">
                {/* Error message inside modal */}
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bx bx-error me-2" />
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input className="form-control" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input className="form-control" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input className="form-control" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
