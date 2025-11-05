import { useEffect, useState, useRef } from "react";
import {
  getAllPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from "../../services/dashboardService";

const OemPromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [createForm, setCreateForm] = useState({
    description: "",
    discountPercent: "",
    startDate: "",
    endDate: ""
  });

  // Pagination, search
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimeout = useRef();

  useEffect(() => {
    // Debounce search input
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 350);
    return () => clearTimeout(searchTimeout.current);
  }, [searchTerm]);

  useEffect(() => {
    // Always filter by type OEM
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (pageSize !== 10) params.set('pageSize', pageSize);
    if (currentPage !== 1) params.set('page', currentPage);
    params.set('filters', JSON.stringify({ type: "OEM" }));
    const url = `/evm-promotions${params.toString() ? '?' + params.toString() : ''}`;
    if (window.location.pathname + window.location.search !== url) {
      window.history.pushState({}, '', url);
    }
    loadPromotions();
  }, [currentPage, pageSize, debouncedSearch]);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: currentPage,
        pageSize,
        search: debouncedSearch || undefined,
        filters: JSON.stringify({ type: "OEM" })
      };
      const response = await getAllPromotions(params);
      let items = [];
      let total = 0;
      if (response?.data?.items) {
        items = response.data.items;
        total = response.data.totalResults || items.length;
      } else if (Array.isArray(response?.data)) {
        items = response.data;
        total = items.length;
      } else if (Array.isArray(response)) {
        items = response;
        total = items.length;
      }
      setPromotions(items);
      setTotalResults(total);
      setTotalPages(Math.max(1, Math.ceil(total / pageSize)));
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to load promotions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (promo) => {
    try {
      const response = await getPromotionById(promo.id);
      if (response?.data) {
        setSelectedPromotion(response.data);
        setShowDetailModal(true);
        setIsEditing(false);
        setEditForm(null);
      }
    } catch (err) {
      setError("Failed to load promotion details.");
    }
  };

  const handleDeleteClick = (promo) => {
    setPromotionToDelete(promo);
    setShowDeleteModal(true);
  };

  const handleOpenCreate = () => {
    setCreateForm({
      description: "",
      discountPercent: "",
      startDate: "",
      endDate: ""
    });
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createPromotion({
        type: "OEM",
        description: createForm.description,
        discountPercent: Number(createForm.discountPercent) || 0,
        startDate: createForm.startDate,
        endDate: createForm.endDate,
      });
      setShowCreateModal(false);
      loadPromotions();
      const alert = document.createElement("div");
      alert.className = "alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3";
      alert.style.zIndex = "9999";
      alert.innerHTML = `Promotion created successfully! <button type='button' class='btn-close' data-bs-dismiss='alert'></button>`;
      document.body.appendChild(alert);
      setTimeout(() => alert.remove(), 3000);
    } catch (err) {
      let apiMsg = "Failed to create promotion.";
      if (err?.response?.data?.message) {
        apiMsg = err.response.data.message;
      } else if (err?.message) {
        apiMsg = err.message;
      }
      setError(apiMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (!selectedPromotion) return;
    if (!isEditing) {
      setEditForm({ ...selectedPromotion });
      setIsEditing(true);
    } else {
      setIsEditing(false);
      setEditForm(null);
    }
  };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      await updatePromotion(editForm.id, {
        ...editForm,
        type: "OEM",
        discountPercent: Number(editForm.discountPercent) || 0,
      });
      setIsEditing(false);
      setEditForm(null);
      setShowDetailModal(false);
      setSelectedPromotion(null);
      loadPromotions();
      const alert = document.createElement("div");
      alert.className = "alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3";
      alert.style.zIndex = "9999";
      alert.innerHTML = `Promotion updated successfully! <button type='button' class='btn-close' data-bs-dismiss='alert'></button>`;
      document.body.appendChild(alert);
      setTimeout(() => alert.remove(), 3000);
    } catch (err) {
      setError("Failed to update promotion.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePromotion(promotionToDelete.id);
      setShowDeleteModal(false);
      setPromotionToDelete(null);
      loadPromotions();
      const alert = document.createElement("div");
      alert.className = "alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3";
      alert.style.zIndex = "9999";
      alert.innerHTML = `Promotion deleted successfully! <button type='button' class='btn-close' data-bs-dismiss='alert'></button>`;
      document.body.appendChild(alert);
      setTimeout(() => alert.remove(), 3000);
    } catch (err) {
      setError("Failed to delete promotion.");
    }
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">
            <i className="bx bx-gift me-2 text-primary"></i>
            OEM Promotion Management
          </h4>
          <p className="text-muted mb-0">View and manage OEM promotions</p>
        </div>
        <div className="d-flex align-items-center">
          <button className="btn btn-outline-primary" onClick={handleOpenCreate}>
            <i className="bx bx-plus me-1"></i>
            New OEM Promotion
          </button>
        </div>
      </div>

      {/* Error message in modal only */}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={handleCreateSubmit}>
              <div className="modal-header">
                <h5 className="modal-title"><i className="bx bx-plus me-2"></i>Create OEM Promotion</h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <div className="modal-body">
                {/* Only description, discountPercent, startDate, endDate fields */}
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <input type="text" className="form-control" value={createForm.description} onChange={e => setCreateForm({ ...createForm, description: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Discount Percent</label>
                  <input type="number" className="form-control" value={createForm.discountPercent} onChange={e => setCreateForm({ ...createForm, discountPercent: e.target.value })} required min="0" max="100" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Start Date</label>
                  <input type="date" className="form-control" value={createForm.startDate} onChange={e => setCreateForm({ ...createForm, startDate: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">End Date</label>
                  <input type="date" className="form-control" value={createForm.endDate} onChange={e => setCreateForm({ ...createForm, endDate: e.target.value })} required />
                </div>
                {error && (
                  <div className="alert alert-danger mt-2" role="alert">
                    {error}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search/PageSize */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by description..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Page size</label>
              <select className="form-select" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}>
                {[5,10,20,50,100].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="col-12 mt-2 d-flex justify-content-end">
              <button className="btn btn-outline-secondary" onClick={() => { setSearchTerm(''); setPageSize(10); setCurrentPage(1); }}>
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">OEM Promotions List</h5>
          <span className="badge bg-label-primary">{totalResults} Total</span>
        </div>
        <div className="table-responsive text-nowrap">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading promotions...</p>
            </div>
          ) : promotions.length === 0 ? (
            <div className="text-center py-5">
              <i className="bx bx-gift display-1 text-muted"></i>
              <p className="mt-3 text-muted">No promotions found</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Discount</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="table-border-bottom-0">
                {promotions.map((p) => (
                  <tr key={p.id || p._id || p.promotionId}>
                    <td><small className="text-muted">{p.description}</small></td>
                    <td><small className="text-muted">{p.discountPercent}%</small></td>
                    <td><small className="text-muted">{formatDate(p.startDate)}</small></td>
                    <td><small className="text-muted">{formatDate(p.endDate)}</small></td>
                    <td>
                      <div className="dropdown">
                        <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                          <i className="bx bx-dots-vertical-rounded"></i>
                        </button>
                        <div className="dropdown-menu">
                          <button className="dropdown-item" onClick={() => handleViewDetail(p)}>
                            <i className="bx bx-show me-2"></i> View Details
                          </button>
                          <button className="dropdown-item text-danger" onClick={() => handleDeleteClick(p)}>
                            <i className="bx bx-trash me-2"></i> Delete
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
      {showDetailModal && selectedPromotion && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bx bx-gift me-2"></i>
                  OEM Promotion Details
                </h5>
                <div className="d-flex align-items-center">
                  <button type="button" className="btn btn-outline-secondary me-2" onClick={handleEditToggle}>
                    {isEditing ? (<><i className="bx bx-x me-1"></i> Cancel</>) : (<><i className="bx bx-edit me-1"></i> Edit</>)}
                  </button>
                  <button type="button" className="btn-close" onClick={() => { setShowDetailModal(false); setIsEditing(false); setEditForm(null); }}></button>
                </div>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Promotion ID</label>
                    <p className="text-muted">{selectedPromotion.id || '-'}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Type</label>
                    {isEditing ? (
                      <select className="form-select" value={editForm?.type || selectedPromotion.type} disabled>
                        <option value="OEM">OEM</option>
                      </select>
                    ) : (
                      <p className="text-muted">{selectedPromotion.type}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Description</label>
                    {isEditing ? (
                      <input className="form-control" value={editForm?.description || selectedPromotion.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
                    ) : (
                      <p className="text-muted">{selectedPromotion.description}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Discount Percent</label>
                    {isEditing ? (
                      <input className="form-control" type="number" value={editForm?.discountPercent || selectedPromotion.discountPercent} onChange={e => setEditForm({ ...editForm, discountPercent: e.target.value })} min="0" max="100" />
                    ) : (
                      <p className="text-muted">{selectedPromotion.discountPercent}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Start Date</label>
                    {isEditing ? (
                      <input className="form-control" type="date" value={editForm?.startDate || selectedPromotion.startDate?.substring(0,10)} onChange={e => setEditForm({ ...editForm, startDate: e.target.value })} />
                    ) : (
                      <p className="text-muted">{formatDate(selectedPromotion.startDate)}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">End Date</label>
                    {isEditing ? (
                      <input className="form-control" type="date" value={editForm?.endDate || selectedPromotion.endDate?.substring(0,10)} onChange={e => setEditForm({ ...editForm, endDate: e.target.value })} />
                    ) : (
                      <p className="text-muted">{formatDate(selectedPromotion.endDate)}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Created At</label>
                    <p className="text-muted">{formatDate(selectedPromotion.createdAt)}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Updated At</label>
                    <p className="text-muted">{formatDate(selectedPromotion.updatedAt)}</p>
                  </div>
                  <div className="col-12">
                    {isEditing ? (
                      <div className="d-flex justify-content-end">
                        <button type="button" className="btn btn-outline-secondary me-2" onClick={handleEditToggle}>Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={handleSaveEdit}>Save</button>
                      </div>
                    ) : null}
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
      {showDeleteModal && promotionToDelete && (
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
                <p>Are you sure you want to delete this promotion?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDeletePromotion}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* End main container */}
  </div>
        

  )}
export default OemPromotionManagement;
