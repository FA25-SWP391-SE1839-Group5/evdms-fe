import React, { useState, useEffect, useMemo } from 'react';
import {
    Plus,
    Search,
    Edit,
    // Trash, // [BỎ] Không cần icon Trash nữa
    AlertCircle,
    CheckCircle,
    MoreVertical,
    Eye // [MỚI] Thêm icon Eye
} from 'lucide-react';
import {
    getAllCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer 
} from '../../../services/dashboardService';

import CustomerFormModal from './CustomerModal';
import CustomerViewModal from './CustomerDetailsModal';

// --- Helper Functions ---
const getAvatarInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length === 1) return name.substring(0, 1).toUpperCase();
    return (parts[0].substring(0, 1) + (parts.length > 1 ? parts[parts.length - 1].substring(0, 1) : '')).toUpperCase();
};

const formatCustomerId = (id) => `#${id?.slice(-6).toUpperCase() || 'N/A'}`;

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Pagination & Filter
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [globalSearch, setGlobalSearch] = useState('');
    const [selectedCustomers, setSelectedCustomers] = useState(new Set());

    // Modal States
    const [showModal, setShowModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null); // null: new, object: edit
    
    // [MỚI] State cho View Modal
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewingCustomer, setViewingCustomer] = useState(null);

    // [BỎ] State cho Delete Modal
    // const [showDeleteModal, setShowDeleteModal] = useState(false);
    // const [deletingCustomerId, setDeletingCustomerId] = useState(null);
    // const [isDeleting, setIsDeleting] = useState(false);

    // Fetch Data
    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await getAllCustomers();
            const customerList = response.data?.data?.items || response.data?.items || response.data || [];
            setCustomers(customerList);
        } catch (err) {
            const errMsg = err.response?.data?.message || err.message || 'Failed to load customers';
            setError(errMsg);
            console.error("Fetch Customers Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Auto-hide alerts
    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => { setError(''); setSuccess(''); }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    // Filter Logic
    const filteredCustomers = useMemo(() => {
        return customers.filter(customer => {
            const searchLower = globalSearch.toLowerCase();
            return (
                (customer.fullName || '').toLowerCase().includes(searchLower) ||
                (customer.email || '').toLowerCase().includes(searchLower) ||
                (customer.phone || '').toLowerCase().includes(searchLower) ||
                (customer.address || '').toLowerCase().includes(searchLower)
            );
        });
    }, [customers, globalSearch]);

    // Pagination Logic
    const totalItems = filteredCustomers.length;
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    const paginatedCustomers = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredCustomers.slice(startIndex, startIndex + pageSize);
    }, [filteredCustomers, currentPage, pageSize]);
    const startEntry = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endEntry = Math.min(currentPage * pageSize, totalItems);

    // --- Handlers ---
    
    const handleFilterChange = (e) => {
        setCurrentPage(1);
        setGlobalSearch(e.target.value);
    };
    const handlePageSizeChange = (e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); };
    const handlePageChange = (newPage) => { if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage); };
    
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedCustomers(new Set(paginatedCustomers.map(c => c.id)));
        } else {
            setSelectedCustomers(new Set());
        }
    };

    const handleSelectOne = (id) => {
        const newSelection = new Set(selectedCustomers);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedCustomers(newSelection);
    };

    // Modal Handlers (Add / Edit)
    const handleAddNew = () => {
        setEditingCustomer({}); // {} nghĩa là "add mode"
        setShowModal(true);
    };

    const handleEdit = (customer) => {
        setEditingCustomer(customer); // object nghĩa là "edit mode"
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditingCustomer(null);
    };

    const handleModalSave = async (formData) => {
        setError('');
        setSuccess('');
        setIsProcessing(true);
        try {
            if (formData.id) {
                await updateCustomer(formData.id, formData);
                setSuccess('Customer updated successfully!');
            } else {
                await createCustomer(formData);
                setSuccess('Customer created successfully!');
            }
            await fetchData(); // Refetch data
            handleModalClose(); // Close modal on success
        } catch (err) {
            const errMsg = err.response?.data?.message || err.message || 'Failed to save customer';
            setError(errMsg);
            throw err;
        } finally {
            setIsProcessing(false); // [MỚI]
        }
    };

    // [MỚI] View Modal Handlers
    const handleView = (customer) => {
        setViewingCustomer(customer);
        setShowViewModal(true);
    };

    const handleViewModalClose = () => {
        setShowViewModal(false);
        setViewingCustomer(null);
    };

    const handleDelete = async (customer) => {
        const customerName = customer.fullName || 'this customer';
        
        // Dùng confirm dialog của trình duyệt
        if (window.confirm(`Are you sure you want to delete "${customerName}"?`)) {
            setIsProcessing(true);
            setError('');
            setSuccess('');
            try {
                await deleteCustomer(customer.id);
                setSuccess('Customer deleted successfully!');
                await fetchData(); // Refetch data
            } catch (err) {
                const errMsg = err.response?.data?.message || err.message || 'Failed to delete customer';
                setError(errMsg);
            } finally {
                setIsProcessing(false);
            }
        }
    };
    
    // --- Render ---

    if (loading) {
        return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
    }

    return (
        <>
            {/* Thông báo */}
            {error && (
                <div className="alert alert-danger alert-dismissible d-flex align-items-center mb-4" role="alert">
                    <AlertCircle size={20} className="me-2" />
                    <div className="flex-grow-1">{error}</div>
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
            )}
            {success && (
                <div className="alert alert-success alert-dismissible d-flex align-items-center mb-4" role="alert">
                    <CheckCircle size={20} className="me-2" />
                    <div className="flex-grow-1">{success}</div>
                    <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
                </div>
            )}

            {/* Bảng dữ liệu */}
            <div className="card">
                <div className="card-header border-bottom">
                    {/* Header: Search và Add Button */}
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                        <div className="input-group" style={{ maxWidth: '300px' }}>
                            <span className="input-group-text"><Search size={16} /></span>
                            <input
                                type="search"
                                value={globalSearch}
                                onChange={handleFilterChange}
                                className="form-control"
                                placeholder="Search Customers..."
                            />
                        </div>
                        <div className="d-flex align-items-center gap-3">
                            <label className="d-flex align-items-center"> 
                                Show &nbsp; 
                                <select 
                                    className="form-select" 
                                    value={pageSize} 
                                    onChange={handlePageSizeChange} 
                                    style={{width:'auto'}}
                                > 
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option> 
                                </select> 
                            </label>
                            <button
                                type="button"
                                className="btn btn-primary d-flex align-items-center"
                                onClick={handleAddNew}
                            >
                                <Plus size={16} className="me-1" />
                                Add Customer
                            </button>
                        </div>
                    </div>
                
                    <div className="table-responsive text-nowrap">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th style={{width: '40px'}}>
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            onChange={handleSelectAll}
                                            checked={paginatedCustomers.length > 0 && selectedCustomers.size === paginatedCustomers.length}
                                            disabled={isProcessing}
                                        />
                                    </th>
                                    <th>Customer</th>
                                    <th>Customer ID</th>
                                    <th>Phone</th>
                                    <th>Address</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-border-bottom-0">
                                {paginatedCustomers.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center py-4">
                                        {totalItems === 0 && !globalSearch ? 'No customers found.' : 'No customers match your filters.'}
                                    </td></tr>
                                ) : (
                                    paginatedCustomers.map(customer => {
                                        return (
                                            <tr 
                                                key={customer.id} 
                                                className={selectedCustomers.has(customer.id) ? 'table-active' : ''}  
                                            >
                                                <td>
                                                    <input 
                                                        className="form-check-input" 
                                                        type="checkbox"
                                                        checked={selectedCustomers.has(customer.id)}
                                                        onChange={() => handleSelectOne(customer.id)}
                                                    />
                                                </td>
                                                <td>
                                                    <div className="d-flex justify-content-start align-items-center">
                                                        <div className="avatar avatar-sm me-3"> 
                                                            <span className={`avatar-initial rounded-circle bg-label-secondary`}>
                                                                {getAvatarInitials(customer.fullName)}
                                                            </span> 
                                                        </div>
                                                        <div className="d-flex flex-column">
                                                            <span className="fw-semibold">{customer.fullName}</span>
                                                            <small className="text-muted">{customer.email || 'No Email'}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td><span className="fw-semibold">{formatCustomerId(customer.id)}</span></td>
                                                <td>{customer.phone || 'N/A'}</td>
                                                <td>{customer.address || 'N/A'}</td>
                                            
                                                {/* Actions Dropdown */}
                                                <td>
                                                    <div className="d-flex gap-1">
                                                        {/* Delete Button */}
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-icon btn-text-danger rounded-pill"
                                                            title="Delete"
                                                            onClick={() => handleDelete(customer)}
                                                            disabled={isProcessing}
                                                        >
                                                            <i className="bx bx-trash" />
                                                        </button>
                                                        <div className="dropdown">
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-icon btn-text-secondary rounded-pill"
                                                                data-bs-toggle="dropdown"
                                                                aria-expanded="false"
                                                                disabled={isProcessing}
                                                            >
                                                                <MoreVertical size={18} />
                                                            </button>
                                                            <ul className="dropdown-menu dropdown-menu-end">
                                                                {/* Nút View */}
                                                                <li>
                                                                    <button 
                                                                        className="dropdown-item d-flex align-items-center" 
                                                                        onClick={() => handleView(customer)}
                                                                    >
                                                                        <Eye size={16} className="me-2" /> View Details
                                                                    </button>
                                                                </li>
                                                                {/* Edit */}
                                                                <li>
                                                                    <button 
                                                                        className="dropdown-item d-flex align-items-center" 
                                                                        onClick={() => handleEdit(customer)}
                                                                    >
                                                                        <Edit size={16} className="me-2" /> Edit
                                                                    </button>
                                                                </li>
                                                            </ul>
                                                        </div>
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
                    <div className="d-flex justify-content-between align-items-center p-3 border-top">
                        <small className="text-muted">Showing {startEntry} to {endEntry} of {totalItems} entries</small>
                        <nav>
                            <ul className="pagination pagination-sm mb-0">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}> 
                                    <button 
                                        className="page-link" 
                                        onClick={() => handlePageChange(currentPage - 1)}
                                    >
                                        &laquo;
                                    </button> 
                                </li>
                                <li className="page-item active">
                                    <span className="page-link">{currentPage}</span>
                                </li>
                                <li className="page-item disabled">
                                    <span className="page-link text-muted">of {totalPages}</span>
                                </li>
                                <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}> 
                                    <button 
                                        className="page-link" 
                                        onClick={() => handlePageChange(currentPage + 1)}
                                    >
                                        &raquo;
                                    </button> 
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Render Modals */}
            <CustomerFormModal
                show={showModal}
                onClose={handleModalClose}
                onSave={handleModalSave}
                customer={editingCustomer}
            />

            {/* Render Details Modal */}
            <CustomerViewModal
                show={showViewModal}
                onClose={handleViewModalClose}
                customer={viewingCustomer}
            />

            {/* [CẬP NHẬT] Overlay cho modal */}
            {(showModal || showViewModal) && <div className="modal-backdrop fade show"></div>}
        </>
    );
};

export default CustomerManagement;