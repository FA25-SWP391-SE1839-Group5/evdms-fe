import React, { useState, useEffect } from 'react';
import {
  getAllInventories,
  getInventoryById,
  createInventory,
  updateInventory,
  adjustInventoryQuantity,
  deleteInventory
} from '../../services/evm/inventoryService';
import { getAllVehicleVariants } from '../../services/evm/vehicleVariantService';

const InventoryManagement = () => {
  // State management
  const [inventories, setInventories] = useState([]);
  const [variants, setVariants] = useState([]);
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
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view', 'adjust'
  const [currentInventory, setCurrentInventory] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    variantId: '',
    quantity: 0
  });

  // Adjust quantity modal
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustData, setAdjustData] = useState({
    inventoryId: '',
    variantId: '',
    currentQuantity: 0,
    adjustment: 0,
    action: 'add' // 'add' or 'remove'
  });

  // Delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [inventoryToDelete, setInventoryToDelete] = useState(null);

  // Fetch variants for dropdown
  useEffect(() => {
    const fetchVariantsData = async () => {
      try {
        const response = await getAllVehicleVariants({ page: 1, pageSize: 100 });
        // Get variants from response
        const variantsList = response.data?.data?.items || response.data?.items || response.data || [];
        setVariants(variantsList);
      } catch (err) {
        console.error('Error fetching variants:', err);
      }
    };
    fetchVariantsData();
  }, []);

  // Fetch inventories on mount and when filters change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllInventories({
          page,
          pageSize,
          search: searchTerm,
          sortBy,
          sortOrder: 'asc'
        });
        setInventories(data.items);
        setTotalResults(data.totalResults);
      } catch (err) {
        setError('Failed to fetch inventories: ' + (err.message || 'Unknown error'));
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, pageSize, searchTerm, sortBy]);

  // Fetch inventories
  const fetchInventories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllInventories({
        page,
        pageSize,
        search: searchTerm,
        sortBy,
        sortOrder: 'asc'
      });
      setInventories(data.items);
      setTotalResults(data.totalResults);
    } catch (err) {
      setError('Failed to fetch inventories: ' + (err.message || 'Unknown error'));
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
    setFormData({ 
      variantId: variants[0]?.id || '', 
      quantity: 0
    });
    setCurrentInventory(null);
    setShowModal(true);
  };

  // Open modal for edit
  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const inventory = await getInventoryById(id);
      setCurrentInventory(inventory);
      setFormData({
        variantId: inventory.variantId,
        quantity: inventory.quantity
      });
      setModalMode('edit');
      setShowModal(true);
    } catch (err) {
      setError('Failed to fetch inventory details: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Open modal for view
  const handleView = async (id) => {
    try {
      setLoading(true);
      const inventory = await getInventoryById(id);
      setCurrentInventory(inventory);
      setFormData({
        variantId: inventory.variantId,
        quantity: inventory.quantity
      });
      setModalMode('view');
      setShowModal(true);
    } catch (err) {
      setError('Failed to fetch inventory details: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Open adjust quantity modal
  const handleAdjust = async (id) => {
    try {
      setLoading(true);
      const inventory = await getInventoryById(id);
      setAdjustData({
        inventoryId: id,
        variantId: inventory.variantId,
        currentQuantity: inventory.quantity,
        adjustment: 0,
        action: 'add'
      });
      setShowAdjustModal(true);
    } catch (err) {
      setError('Failed to fetch inventory details: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle adjust data change
  const handleAdjustChange = (e) => {
    const { name, value } = e.target;
    setAdjustData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.variantId) {
      setError('Please select a vehicle variant');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        variantId: formData.variantId,
        quantity: Number(formData.quantity) || 0
      };

      if (modalMode === 'create') {
        await createInventory(payload);
        setSuccess('Inventory created successfully!');
      } else if (modalMode === 'edit') {
        await updateInventory(currentInventory.id, payload);
        setSuccess('Inventory updated successfully!');
      }

      // Refresh list and close modal
      await fetchInventories();
      setTimeout(() => {
        setShowModal(false);
        setSuccess(null);
      }, 1500);
    } catch (err) {
      setError('Failed to save inventory: ' + (err.response?.data?.message || err.message || 'Unknown error'));
      console.error('Save error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle adjust quantity submit
  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const adjustmentValue = Number(adjustData.adjustment);
    if (adjustmentValue === 0) {
      setError('Adjustment value must be greater than 0');
      return;
    }

    // Calculate new quantity based on action
    const quantityChange = adjustData.action === 'add' ? adjustmentValue : -adjustmentValue;
    const newQuantity = adjustData.currentQuantity + quantityChange;

    if (newQuantity < 0) {
      setError(`Cannot remove ${Math.abs(quantityChange)} units. Only ${adjustData.currentQuantity} available.`);
      return;
    }

    try {
      setLoading(true);
      // API expects: { variantId, quantity: newTotalQuantity }
      await adjustInventoryQuantity(adjustData.inventoryId, adjustData.variantId, newQuantity);
      setSuccess(`Successfully ${adjustData.action === 'add' ? 'added' : 'removed'} ${Math.abs(quantityChange)} units!`);
      
      // Refresh list and close modal
      await fetchInventories();
      setTimeout(() => {
        setShowAdjustModal(false);
        setSuccess(null);
      }, 1500);
    } catch (err) {
      setError('Failed to adjust inventory: ' + (err.response?.data?.message || err.message || 'Unknown error'));
      console.error('Adjust error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDeleteClick = (inventory) => {
    setInventoryToDelete(inventory);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!inventoryToDelete) return;

    try {
      setLoading(true);
      await deleteInventory(inventoryToDelete.id);
      setSuccess('Inventory deleted successfully!');
      setShowDeleteModal(false);
      setInventoryToDelete(null);
      await fetchInventories();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to delete inventory: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Get variant name by ID
  const getVariantName = (variantId) => {
    const variant = variants.find(v => v.id === variantId);
    return variant ? `${variant.modelName || variant.name || 'Unknown'} - ${variant.variantName || variant.trim || ''}` : variantId;
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

  // Get stock status
  const getStockStatus = (quantity) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'danger' };
    if (quantity <= 5) return { label: 'Low Stock', color: 'warning' };
    if (quantity <= 20) return { label: 'In Stock', color: 'info' };
    return { label: 'Well Stocked', color: 'success' };
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">OEM Inventory Management</h4>
          <p className="text-muted mb-0">Manage vehicle inventory, stock levels, and adjustments</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          <i className="bx bx-plus me-1" />
          Add New Inventory
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
                  placeholder="Search by variant..."
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
                <option value="quantity">Quantity</option>
                <option value="createdAt">Created Date</option>
                <option value="updatedAt">Updated Date</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="card">
        <div className="card-body">
          {loading && !showModal && !showAdjustModal ? (
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
                      <th>Vehicle Variant</th>
                      <th>Quantity</th>
                      <th>Status</th>
                      <th>Created At</th>
                      <th>Updated At</th>
                      <th style={{ width: '200px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventories.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-5 text-muted">
                          <i className="bx bx-package bx-lg mb-2" />
                          <p>No inventory records found</p>
                        </td>
                      </tr>
                    ) : (
                      inventories.map((inventory) => {
                        const status = getStockStatus(inventory.quantity);
                        return (
                          <tr key={inventory.id}>
                            <td>
                              <strong>{getVariantName(inventory.variantId)}</strong>
                            </td>
                            <td>
                              <h5 className={`mb-0 ${inventory.quantity === 0 ? 'text-danger' : 'text-primary'}`}>
                                {inventory.quantity}
                              </h5>
                            </td>
                            <td>
                              <span className={`badge bg-label-${status.color}`}>
                                {status.label}
                              </span>
                            </td>
                            <td>{formatDate(inventory.createdAt)}</td>
                            <td>{formatDate(inventory.updatedAt)}</td>
                            <td>
                              <div className="btn-group" role="group">
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() => handleAdjust(inventory.id)}
                                  title="Adjust Quantity"
                                >
                                  <i className="bx bx-adjust" />
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-info"
                                  onClick={() => handleView(inventory.id)}
                                  title="View Details"
                                >
                                  <i className="bx bx-show" />
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleEdit(inventory.id)}
                                  title="Edit"
                                >
                                  <i className="bx bx-edit" />
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDeleteClick(inventory)}
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
                  {modalMode === 'create' && <><i className="bx bx-plus me-2" />Create New Inventory</>}
                  {modalMode === 'edit' && <><i className="bx bx-edit me-2" />Edit Inventory</>}
                  {modalMode === 'view' && <><i className="bx bx-show me-2" />View Inventory</>}
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
                  {/* Variant Selection */}
                  <div className="mb-3">
                    <label className="form-label">
                      Vehicle Variant <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      name="variantId"
                      value={formData.variantId}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      required
                    >
                      <option value="">Select a variant...</option>
                      {variants.map(variant => (
                        <option key={variant.id} value={variant.id}>
                          {variant.modelName || variant.name || 'Unknown'} - {variant.variantName || variant.trim || ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div className="mb-3">
                    <label className="form-label">
                      Quantity <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      disabled={modalMode === 'view'}
                      min="0"
                      step="1"
                      required
                      placeholder="Enter initial quantity"
                    />
                    <small className="text-muted">
                      {modalMode === 'create' ? 'Enter initial stock quantity' : 'Update total quantity'}
                    </small>
                  </div>

                  {/* View mode details */}
                  {modalMode === 'view' && currentInventory && (
                    <div className="mt-3">
                      <hr />
                      <div className="row">
                        <div className="col-md-12">
                          <p className="mb-2">
                            <strong>Inventory ID:</strong><br />
                            <code className="text-muted">{currentInventory.id}</code>
                          </p>
                        </div>
                        <div className="col-md-6 mt-2">
                          <p className="mb-2">
                            <strong>Created At:</strong><br />
                            {formatDate(currentInventory.createdAt)}
                          </p>
                        </div>
                        <div className="col-md-6 mt-2">
                          <p className="mb-2">
                            <strong>Updated At:</strong><br />
                            {formatDate(currentInventory.updatedAt)}
                          </p>
                        </div>
                        <div className="col-md-12 mt-2">
                          <p className="mb-2">
                            <strong>Status:</strong><br />
                            <span className={`badge bg-label-${getStockStatus(currentInventory.quantity).color}`}>
                              {getStockStatus(currentInventory.quantity).label}
                            </span>
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

      {/* Adjust Quantity Modal */}
      {showAdjustModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">
                  <i className="bx bx-adjust me-2" />
                  Adjust Inventory Quantity
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowAdjustModal(false)}
                  disabled={loading}
                />
              </div>
              <form onSubmit={handleAdjustSubmit}>
                <div className="modal-body">
                  {/* Current Quantity Display */}
                  <div className="alert alert-info">
                    <strong>Current Stock:</strong> {adjustData.currentQuantity} units
                  </div>

                  {/* Action Selection */}
                  <div className="mb-3">
                    <label className="form-label">Action</label>
                    <div className="btn-group w-100" role="group">
                      <input
                        type="radio"
                        className="btn-check"
                        name="action"
                        id="action-add"
                        value="add"
                        checked={adjustData.action === 'add'}
                        onChange={handleAdjustChange}
                      />
                      <label className="btn btn-outline-success" htmlFor="action-add">
                        <i className="bx bx-plus me-1" />
                        Add Stock
                      </label>

                      <input
                        type="radio"
                        className="btn-check"
                        name="action"
                        id="action-remove"
                        value="remove"
                        checked={adjustData.action === 'remove'}
                        onChange={handleAdjustChange}
                      />
                      <label className="btn btn-outline-danger" htmlFor="action-remove">
                        <i className="bx bx-minus me-1" />
                        Remove Stock
                      </label>
                    </div>
                  </div>

                  {/* Adjustment Quantity */}
                  <div className="mb-3">
                    <label className="form-label">
                      Quantity to {adjustData.action === 'add' ? 'Add' : 'Remove'}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="adjustment"
                      value={adjustData.adjustment}
                      onChange={handleAdjustChange}
                      min="1"
                      max={adjustData.action === 'remove' ? adjustData.currentQuantity : undefined}
                      step="1"
                      required
                      placeholder="Enter quantity"
                    />
                  </div>

                  {/* Preview Result */}
                  {adjustData.adjustment > 0 && (
                    <div className={`alert ${adjustData.action === 'add' ? 'alert-success' : 'alert-warning'}`}>
                      <strong>New Stock Level:</strong>{' '}
                      {adjustData.currentQuantity + (adjustData.action === 'add' ? Number(adjustData.adjustment) : -Number(adjustData.adjustment))} units
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowAdjustModal(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className={`btn ${adjustData.action === 'add' ? 'btn-success' : 'btn-warning'}`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Adjusting...
                      </>
                    ) : (
                      <>
                        <i className={`bx ${adjustData.action === 'add' ? 'bx-plus' : 'bx-minus'} me-1`} />
                        {adjustData.action === 'add' ? 'Add' : 'Remove'} Stock
                      </>
                    )}
                  </button>
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
                <p>Are you sure you want to delete this inventory record?</p>
                {inventoryToDelete && (
                  <div className="alert alert-warning">
                    <p className="mb-2">
                      <strong>Variant:</strong> {getVariantName(inventoryToDelete.variantId)}
                    </p>
                    <p className="mb-2">
                      <strong>Current Quantity:</strong> {inventoryToDelete.quantity}
                    </p>
                    <p className="mb-0 mt-2 text-danger small">
                      This action cannot be undone. All inventory data will be lost.
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

export default InventoryManagement;
