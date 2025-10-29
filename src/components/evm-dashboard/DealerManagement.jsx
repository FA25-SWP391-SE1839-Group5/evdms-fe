import React, { useState, useEffect } from 'react';
import {
  getAllDealers,
  getDealerById,
  createDealer,
  updateDealer,
  deleteDealer
} from '../../services/evm/dealerService';

// Hardcoded regions as per requirement
const REGIONS = [
  'Ho Chi Minh City',
  'Hanoi',
  'Da Nang',
  'Nha Trang'
];

const DealerManagement = () => {
  // State management
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Pagination & filtering
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [currentDealer, setCurrentDealer] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    address: ''
  });

  // Delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dealerToDelete, setDealerToDelete] = useState(null);

  // Fetch dealers on mount and when filters change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllDealers({
          page,
          pageSize,
          search: searchTerm,
          sortBy,
          sortOrder: 'asc'
        });
        setDealers(data.items);
        setTotalResults(data.totalResults);
      } catch (err) {
        setError('Failed to fetch dealers: ' + (err.message || 'Unknown error'));
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, pageSize, searchTerm, sortBy]);

  // Fetch dealers
  const fetchDealers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllDealers({
        page,
        pageSize,
        search: searchTerm,
        sortBy,
        sortOrder: 'asc'
      });
      setDealers(data.items);
      setTotalResults(data.totalResults);
    } catch (err) {
      setError('Failed to fetch dealers: ' + (err.message || 'Unknown error'));
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  // Open modal for create
  const handleCreate = () => {
    setModalMode('create');
    setFormData({ name: '', region: REGIONS[0], address: '' });
    setCurrentDealer(null);
    setShowModal(true);
  };

  // Open modal for edit
  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const dealer = await getDealerById(id);
      setCurrentDealer(dealer);
      setFormData({
        name: dealer.name,
        region: dealer.region,
        address: dealer.address
      });
      setModalMode('edit');
      setShowModal(true);
    } catch (err) {
      setError('Failed to fetch dealer details: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Open modal for view
  const handleView = async (id) => {
    try {
      setLoading(true);
      const dealer = await getDealerById(id);
      setCurrentDealer(dealer);
      setFormData({
        name: dealer.name,
        region: dealer.region,
        address: dealer.address
      });
      setModalMode('view');
      setShowModal(true);
    } catch (err) {
      setError('Failed to fetch dealer details: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Dealer name is required');
      return;
    }
    if (!formData.region) {
      setError('Region is required');
      return;
    }
    if (!formData.address.trim()) {
      setError('Address is required');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name,
        region: formData.region,
        address: formData.address
      };

      if (modalMode === 'create') {
        await createDealer(payload);
        setSuccess('Dealer created successfully!');
      } else if (modalMode === 'edit') {
        await updateDealer(currentDealer.id, payload);
        setSuccess('Dealer updated successfully!');
      }

      // Refresh list and close modal
      await fetchDealers();
      setTimeout(() => {
        setShowModal(false);
        setSuccess(null);
      }, 1500);
    } catch (err) {
      setError('Failed to save dealer: ' + (err.response?.data?.message || err.message || 'Unknown error'));
      console.error('Save error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDeleteClick = (dealer) => {
    setDealerToDelete(dealer);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!dealerToDelete) return;

    try {
      setLoading(true);
      await deleteDealer(dealerToDelete.id);
      setSuccess('Dealer deleted successfully!');
      setShowDeleteModal(false);
      setDealerToDelete(null);
      await fetchDealers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to delete dealer: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalResults / pageSize);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get region badge color
  const getRegionColor = (region) => {
    const colors = {
      'Ho Chi Minh City': 'primary',
      'Hanoi': 'success',
      'Da Nang': 'info',
      'Nha Trang': 'warning'
    };
    return colors[region] || 'secondary';
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Dealer Management</h4>
          <p className="text-muted mb-0">Manage dealer locations, regions, and contracts</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          <i className="bx bx-plus me-1" />
          Add New Dealer
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bx bx-error me-2" />
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)} />
        </div>
      )}
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bx bx-check-circle me-2" />
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess(null)} />
        </div>
      )}

      {/* Search and Filter Card */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bx bx-search" />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by dealer name or region..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select 
                className="form-select" 
                value={pageSize} 
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
              </select>
            </div>
            <div className="col-md-3">
              <select 
                className="form-select" 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="">Sort by...</option>
                <option value="name">Name</option>
                <option value="region">Region</option>
                <option value="createdAt">Created Date</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="card">
        <div className="card-body">
          {loading && !showModal ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Region</th>
                      <th>Address</th>
                      <th>Created At</th>
                      <th>Updated At</th>
                      <th style={{ width: '150px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dealers.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-5 text-muted">
                          <i className="bx bx-store bx-lg mb-2" />
                          <p>No dealers found</p>
                        </td>
                      </tr>
                    ) : (
                      dealers.map((dealer) => (
                        <tr key={dealer.id}>
                          <td>
                            <strong>{dealer.name}</strong>
                          </td>
                          <td>
                            <span className={`badge bg-label-${getRegionColor(dealer.region)}`}>
                              {dealer.region}
                            </span>
                          </td>
                          <td>
                            <div 
                              className="text-truncate" 
                              style={{ maxWidth: '250px' }}
                              title={dealer.address}
                            >
                              {dealer.address}
                            </div>
                          </td>
                          <td>{formatDate(dealer.createdAt)}</td>
                          <td>{formatDate(dealer.updatedAt)}</td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-sm btn-outline-info"
                                onClick={() => handleView(dealer.id)}
                                title="View Details"
                              >
                                <i className="bx bx-show" />
                              </button>
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleEdit(dealer.id)}
                                title="Edit"
                              >
                                <i className="bx bx-edit" />
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteClick(dealer)}
                                title="Delete"
                              >
                                <i className="bx bx-trash" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <div className="text-muted">
                    Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, totalResults)} of {totalResults} results
                  </div>
                  <nav>
                    <ul className="pagination mb-0">
                      <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => setPage(page - 1)}
                          disabled={page === 1}
                        >
                          Previous
                        </button>
                      </li>
                      {[...new Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        if (
                          pageNum === 1 || 
                          pageNum === totalPages || 
                          (pageNum >= page - 1 && pageNum <= page + 1)
                        ) {
                          return (
                            <li 
                              key={pageNum} 
                              className={`page-item ${page === pageNum ? 'active' : ''}`}
                            >
                              <button 
                                className="page-link" 
                                onClick={() => setPage(pageNum)}
                              >
                                {pageNum}
                              </button>
                            </li>
                          );
                        } else if (pageNum === page - 2 || pageNum === page + 2) {
                          return <li key={pageNum} className="page-item disabled"><span className="page-link">...</span></li>;
                        }
                        return null;
                      })}
                      <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => setPage(page + 1)}
                          disabled={page === totalPages}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalMode === 'create' && <><i className="bx bx-plus me-2" />Create New Dealer</>}
                  {modalMode === 'edit' && <><i className="bx bx-edit me-2" />Edit Dealer</>}
                  {modalMode === 'view' && <><i className="bx bx-show me-2" />View Dealer</>}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {/* Name */}
                  <div className="mb-3">
                    <label className="form-label">
                      Dealer Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      required
                      placeholder="e.g., EV Motors Saigon"
                    />
                  </div>

                  {/* Region */}
                  <div className="mb-3">
                    <label className="form-label">
                      Region <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      required
                    >
                      {REGIONS.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>

                  {/* Address */}
                  <div className="mb-3">
                    <label className="form-label">
                      Address <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      name="address"
                      rows="3"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      required
                      placeholder="Enter full address..."
                    />
                  </div>

                  {/* View mode details */}
                  {modalMode === 'view' && currentDealer && (
                    <div className="row">
                      <div className="col-md-6">
                        <p className="mb-2">
                          <strong>Created At:</strong><br />
                          {formatDate(currentDealer.createdAt)}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-2">
                          <strong>Updated At:</strong><br />
                          {formatDate(currentDealer.updatedAt)}
                        </p>
                      </div>
                      <div className="col-12 mt-2">
                        <p className="mb-2">
                          <strong>ID:</strong><br />
                          <code className="text-muted">{currentDealer.id}</code>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowModal(false)}
                    disabled={loading}
                  >
                    {modalMode === 'view' ? 'Close' : 'Cancel'}
                  </button>
                  {modalMode !== 'view' && (
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bx bx-save me-1" />
                          {modalMode === 'create' ? 'Create' : 'Update'}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">
                  <i className="bx bx-trash me-2" />
                  Confirm Delete
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowDeleteModal(false)}
                  disabled={loading}
                />
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this dealer?</p>
                {dealerToDelete && (
                  <div className="alert alert-warning">
                    <strong>{dealerToDelete.name}</strong>
                    <p className="mb-0 mt-2">
                      <small className="text-muted">
                        Region: {dealerToDelete.region}<br />
                        Address: {dealerToDelete.address}
                      </small>
                    </p>
                    <p className="mb-0 mt-2 text-danger small">
                      This action cannot be undone.
                    </p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowDeleteModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={confirmDelete}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <i className="bx bx-trash me-1" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealerManagement;
