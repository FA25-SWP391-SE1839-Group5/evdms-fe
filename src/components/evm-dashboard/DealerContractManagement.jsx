import React, { useState, useEffect } from 'react';
import {
  getAllDealerContracts,
  getDealerContractById,
  createDealerContract,
  updateDealerContract,
  deleteDealerContract,
  getAllDealers
} from '../../services/dealerService';

const DealerContractManagement = () => {
  // State management
  const [contracts, setContracts] = useState([]);
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
  const [currentContract, setCurrentContract] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    dealerId: '',
    startDate: '',
    endDate: '',
    salesTarget: 0,
    outstandingDebt: 0
  });

  // Delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contractToDelete, setContractToDelete] = useState(null);

  // Fetch dealers for dropdown
  useEffect(() => {
    const fetchDealersData = async () => {
      try {
        const data = await getAllDealers({ page: 1, pageSize: 100 });
        setDealers(data.items);
      } catch (err) {
        console.error('Error fetching dealers:', err);
      }
    };
    fetchDealersData();
  }, []);

  // Fetch contracts on mount and when filters change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllDealerContracts({
          page,
          pageSize,
          search: searchTerm,
          sortBy,
          sortOrder: 'desc'
        });
        setContracts(data.items);
        setTotalResults(data.totalResults);
      } catch (err) {
        setError('Failed to fetch dealer contracts: ' + (err.message || 'Unknown error'));
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, pageSize, searchTerm, sortBy]);

  // Fetch contracts
  const fetchContracts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllDealerContracts({
        page,
        pageSize,
        search: searchTerm,
        sortBy,
        sortOrder: 'desc'
      });
      setContracts(data.items);
      setTotalResults(data.totalResults);
    } catch (err) {
      setError('Failed to fetch dealer contracts: ' + (err.message || 'Unknown error'));
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
    const today = new Date().toISOString().split('T')[0];
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const endDate = nextYear.toISOString().split('T')[0];
    
    setFormData({ 
      dealerId: dealers[0]?.id || '', 
      startDate: today,
      endDate: endDate,
      salesTarget: 0,
      outstandingDebt: 0
    });
    setCurrentContract(null);
    setShowModal(true);
  };

  // Open modal for edit
  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const contract = await getDealerContractById(id);
      setCurrentContract(contract);
      
      // Convert ISO dates to YYYY-MM-DD for input fields
      const startDate = contract.startDate ? new Date(contract.startDate).toISOString().split('T')[0] : '';
      const endDate = contract.endDate ? new Date(contract.endDate).toISOString().split('T')[0] : '';
      
      setFormData({
        dealerId: contract.dealerId,
        startDate: startDate,
        endDate: endDate,
        salesTarget: contract.salesTarget,
        outstandingDebt: contract.outstandingDebt
      });
      setModalMode('edit');
      setShowModal(true);
    } catch (err) {
      setError('Failed to fetch contract details: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Open modal for view
  const handleView = async (id) => {
    try {
      setLoading(true);
      const contract = await getDealerContractById(id);
      setCurrentContract(contract);
      
      const startDate = contract.startDate ? new Date(contract.startDate).toISOString().split('T')[0] : '';
      const endDate = contract.endDate ? new Date(contract.endDate).toISOString().split('T')[0] : '';
      
      setFormData({
        dealerId: contract.dealerId,
        startDate: startDate,
        endDate: endDate,
        salesTarget: contract.salesTarget,
        outstandingDebt: contract.outstandingDebt
      });
      setModalMode('view');
      setShowModal(true);
    } catch (err) {
      setError('Failed to fetch contract details: ' + (err.message || 'Unknown error'));
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
    if (!formData.dealerId) {
      setError('Please select a dealer');
      return;
    }
    if (!formData.startDate) {
      setError('Start date is required');
      return;
    }
    if (!formData.endDate) {
      setError('End date is required');
      return;
    }
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      setError('End date must be after start date');
      return;
    }

    try {
      setLoading(true);

      // Convert dates to ISO format for API
      const payload = {
        dealerId: formData.dealerId,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        salesTarget: Number(formData.salesTarget) || 0,
        outstandingDebt: Number(formData.outstandingDebt) || 0
      };

      if (modalMode === 'create') {
        await createDealerContract(payload);
        setSuccess('Dealer contract created successfully!');
      } else if (modalMode === 'edit') {
        await updateDealerContract(currentContract.id, payload);
        setSuccess('Dealer contract updated successfully!');
      }

      // Refresh list and close modal
      await fetchContracts();
      setTimeout(() => {
        setShowModal(false);
        setSuccess(null);
      }, 1500);
    } catch (err) {
      setError('Failed to save contract: ' + (err.response?.data?.message || err.message || 'Unknown error'));
      console.error('Save error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDeleteClick = (contract) => {
    setContractToDelete(contract);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!contractToDelete) return;

    try {
      setLoading(true);
      await deleteDealerContract(contractToDelete.id);
      setSuccess('Dealer contract deleted successfully!');
      setShowDeleteModal(false);
      setContractToDelete(null);
      await fetchContracts();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to delete contract: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Get dealer name by ID
  const getDealerName = (dealerId) => {
    const dealer = dealers.find(d => d.id === dealerId);
    return dealer ? dealer.name : dealerId;
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

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Check if contract is active
  const isContractActive = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  // Get contract status badge
  const getContractStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) {
      return { label: 'Upcoming', color: 'info' };
    } else if (now > end) {
      return { label: 'Expired', color: 'danger' };
    } else {
      return { label: 'Active', color: 'success' };
    }
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Dealer Contract Management</h4>
          <p className="text-muted mb-0">Manage dealer contracts, sales targets, and outstanding debts</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          <i className="bx bx-plus me-1" />
          Add New Contract
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
                  placeholder="Search by dealer or contract..."
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
                <option value="startDate">Start Date</option>
                <option value="endDate">End Date</option>
                <option value="salesTarget">Sales Target</option>
                <option value="outstandingDebt">Outstanding Debt</option>
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
                      <th>Dealer</th>
                      <th>Status</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Sales Target</th>
                      <th>Outstanding Debt</th>
                      <th style={{ width: '150px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-5 text-muted">
                          <i className="bx bx-file bx-lg mb-2" />
                          <p>No dealer contracts found</p>
                        </td>
                      </tr>
                    ) : (
                      contracts.map((contract) => {
                        const status = getContractStatus(contract.startDate, contract.endDate);
                        return (
                          <tr key={contract.id}>
                            <td>
                              <strong>{getDealerName(contract.dealerId)}</strong>
                            </td>
                            <td>
                              <span className={`badge bg-label-${status.color}`}>
                                {status.label}
                              </span>
                            </td>
                            <td>{formatDate(contract.startDate)}</td>
                            <td>{formatDate(contract.endDate)}</td>
                            <td>
                              <strong className="text-primary">
                                {formatCurrency(contract.salesTarget)}
                              </strong>
                            </td>
                            <td>
                              <strong className={contract.outstandingDebt > 0 ? 'text-danger' : 'text-success'}>
                                {formatCurrency(contract.outstandingDebt)}
                              </strong>
                            </td>
                            <td>
                              <div className="btn-group" role="group">
                                <button
                                  className="btn btn-sm btn-outline-info"
                                  onClick={() => handleView(contract.id)}
                                  title="View Details"
                                >
                                  <i className="bx bx-show" />
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleEdit(contract.id)}
                                  title="Edit"
                                >
                                  <i className="bx bx-edit" />
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDeleteClick(contract)}
                                  title="Delete"
                                >
                                  <i className="bx bx-trash" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
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
                      {Array.from({ length: totalPages }, (_, i) => {
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
                  {modalMode === 'create' && <><i className="bx bx-plus me-2" />Create New Contract</>}
                  {modalMode === 'edit' && <><i className="bx bx-edit me-2" />Edit Contract</>}
                  {modalMode === 'view' && <><i className="bx bx-show me-2" />View Contract</>}
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
                  {/* Dealer Selection */}
                  <div className="mb-3">
                    <label className="form-label">
                      Dealer <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      name="dealerId"
                      value={formData.dealerId}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      required
                    >
                      <option value="">Select a dealer...</option>
                      {dealers.map(dealer => (
                        <option key={dealer.id} value={dealer.id}>
                          {dealer.name} - {dealer.region}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Range */}
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Start Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        disabled={modalMode === 'view'}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        End Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        disabled={modalMode === 'view'}
                        required
                      />
                    </div>
                  </div>

                  {/* Sales Target & Outstanding Debt */}
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Sales Target (USD)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="salesTarget"
                        value={formData.salesTarget}
                        onChange={handleInputChange}
                        disabled={modalMode === 'view'}
                        min="0"
                        step="1000"
                        placeholder="0"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Outstanding Debt (USD)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="outstandingDebt"
                        value={formData.outstandingDebt}
                        onChange={handleInputChange}
                        disabled={modalMode === 'view'}
                        min="0"
                        step="100"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* View mode details */}
                  {modalMode === 'view' && currentContract && (
                    <div className="mt-3">
                      <hr />
                      <div className="row">
                        <div className="col-md-6">
                          <p className="mb-2">
                            <strong>Contract ID:</strong><br />
                            <code className="text-muted">{currentContract.id}</code>
                          </p>
                        </div>
                        <div className="col-md-6">
                          <p className="mb-2">
                            <strong>Status:</strong><br />
                            <span className={`badge bg-label-${getContractStatus(currentContract.startDate, currentContract.endDate).color}`}>
                              {getContractStatus(currentContract.startDate, currentContract.endDate).label}
                            </span>
                          </p>
                        </div>
                        <div className="col-md-6 mt-2">
                          <p className="mb-2">
                            <strong>Created At:</strong><br />
                            {formatDate(currentContract.createdAt)}
                          </p>
                        </div>
                        <div className="col-md-6 mt-2">
                          <p className="mb-2">
                            <strong>Updated At:</strong><br />
                            {formatDate(currentContract.updatedAt)}
                          </p>
                        </div>
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
                <p>Are you sure you want to delete this dealer contract?</p>
                {contractToDelete && (
                  <div className="alert alert-warning">
                    <p className="mb-2">
                      <strong>Dealer:</strong> {getDealerName(contractToDelete.dealerId)}
                    </p>
                    <p className="mb-2">
                      <strong>Period:</strong> {formatDate(contractToDelete.startDate)} - {formatDate(contractToDelete.endDate)}
                    </p>
                    <p className="mb-2">
                      <strong>Sales Target:</strong> {formatCurrency(contractToDelete.salesTarget)}
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

export default DealerContractManagement;
