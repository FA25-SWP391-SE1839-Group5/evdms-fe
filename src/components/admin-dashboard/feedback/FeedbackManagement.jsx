import React, { useState, useEffect, useMemo } from 'react';
import {
    Search,
    AlertCircle,
    CheckCircle,
    MoreVertical,
    Eye,
    Trash,
    Edit // Dùng cho "Update Status"
} from 'lucide-react';
import { getAllFeedbacks, patchFeedback, deleteFeedback } from '../../../services/feebackService';
import { getAllCustomers } from '../../../services/dashboardService';
import { getAllDealers } from '../../../services/dealerService';

import FeedbackDetailsModal from './FeedbackDetailsModal';
import FeedbackStatusModal from './FeedbackStatusModal';

// --- Helper Functions ---
const getAvatarInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length === 1) return name.substring(0, 1).toUpperCase();
    return (parts[0].substring(0, 1) + (parts.length > 1 ? parts[parts.length - 1].substring(0, 1) : '')).toUpperCase();
};

const formatDate = (isoString) => isoString ? new Date(isoString).toLocaleString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' }) : 'N/A';

const RenderFeedbackStatus = ({ status }) => {
    let badgeClass = 'secondary';
    const st = String(status).toLowerCase();
    switch (st) {
        case 'new': badgeClass = 'info'; break;
        case 'in progress': badgeClass = 'warning'; break;
        case 'resolved': badgeClass = 'success'; break;
        case 'closed': badgeClass = 'danger'; break;
    }
    const capitalizedStatus = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'N/A';
    return <span className={`badge bg-label-${badgeClass}`}>{capitalizedStatus}</span>;
};

const FeedbackManagement = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [customerMap, setCustomerMap] = useState({});
    const [dealerMap, setDealerMap] = useState({});
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Pagination & Filter
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [globalSearch, setGlobalSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState(''); 
    
    // Modal States
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewingFeedback, setViewingFeedback] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [editingFeedback, setEditingFeedback] = useState(null);

    // Fetch Data
    const fetchData = async () => {
        try {
            if (!feedbacks.length) setLoading(true);
            setError('');

            // Dùng Promise.all để fetch song song
            const [feedbackRes, customerRes, dealerRes] = await Promise.all([
                getAllFeedbacks(),
                getAllCustomers(),
                getAllDealers()
            ]);

            const feedbackList = feedbackRes.data?.data?.items || feedbackRes.data?.items || feedbackRes.data || [];
            setFeedbacks(feedbackList);

            const customerList = customerRes.data?.data?.items || customerRes.data?.items || customerRes.data || [];
            setCustomerMap(customerList.reduce((acc, c) => { acc[c.id] = c.fullName; return acc; }, {}));
            
            const dealerList = dealerRes.data?.data?.items || dealerRes.data?.items || dealerRes.data || [];
            setDealerMap(dealerList.reduce((acc, d) => { acc[d.id] = d.name; return acc; }, {}));

        } catch (err) {
            const errMsg = err.response?.data?.message || err.message || 'Failed to load feedbacks';
            setError(errMsg);
            console.error("Fetch Feedbacks Error:", err);
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
    const filteredFeedbacks = useMemo(() => {
        return feedbacks.filter(fb => {
            const customerName = (customerMap[fb.customerId] || '').toLowerCase();
            const dealerName = (dealerMap[fb.dealerId] || '').toLowerCase();
            const content = (fb.content || '').toLowerCase();
            const status = (fb.status || '').toLowerCase();

            // Lọc theo Status
            if (statusFilter && status !== statusFilter.toLowerCase()) {
                return false;
            }

            // Lọc theo Search
            const searchLower = globalSearch.toLowerCase();
            return (
                customerName.includes(searchLower) ||
                dealerName.includes(searchLower) ||
                content.includes(searchLower) ||
                status.includes(searchLower)
            );
        });
    }, [feedbacks, globalSearch, statusFilter, customerMap, dealerMap]);

    // Pagination Logic
    const totalItems = filteredFeedbacks.length;
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    const paginatedFeedbacks = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredFeedbacks.slice(startIndex, startIndex + pageSize);
    }, [filteredFeedbacks, currentPage, pageSize]);
    const startEntry = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endEntry = Math.min(currentPage * pageSize, totalItems);

    // --- Handlers ---
    
    const handleFilterChange = (e) => {
        setCurrentPage(1);
        setGlobalSearch(e.target.value);
    };

    const handleStatusFilterChange = (e) => {
        setCurrentPage(1);
        setStatusFilter(e.target.value);
    };
    
    const handlePageSizeChange = (e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); };
    const handlePageChange = (newPage) => { if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage); };
    
    // View Modal
    const handleView = (fb) => {
        setViewingFeedback(fb);
        setShowViewModal(true);
    };

    // Status Modal
    const handleEditStatus = (fb) => {
        setEditingFeedback(fb);
        setShowStatusModal(true);
    };
    
    const handleSaveStatus = async (newStatus) => {
        if (!editingFeedback) return;
        
        setError('');
        setSuccess('');
        setIsProcessing(true);
        try {
            await patchFeedback(editingFeedback.id, { status: newStatus });
            setSuccess('Feedback status updated!');
            await fetchData(); // Refetch
            setShowStatusModal(false);
            setEditingFeedback(null);
        } catch (err) {
            const errMsg = err.response?.data?.message || 'Failed to update status';
            setError(errMsg);
            throw err; // Ném lỗi để modal (isSaving) biết
        } finally {
            setIsProcessing(false);
        }
    };

    // Delete
    const handleDelete = async (fb) => {
        const fbContent = fb.content ? `"${fb.content.substring(0, 20)}..."` : 'this feedback';
        
        if (window.confirm(`Are you sure you want to delete ${fbContent}?`)) {
            setIsProcessing(true);
            setError('');
            setSuccess('');
            try {
                await deleteFeedback(fb.id);
                setSuccess('Feedback deleted successfully!');
                await fetchData(); // Refetch data
            } catch (err) {
                const errMsg = err.response?.data?.message || 'Failed to delete feedback';
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
            {/* <h2>Feedback</h2> */}
            {/* <div className="card"><div className="card-body">Feedback page - Coming soon...</div></div> */}

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

            <div className="card">
                <div className="card-header border-bottom">
                    <div className="d-flex justify-content-between align-items-center row py-3 gap-3 gap-md-0">
                        {/* Show Entries */}
                        <div className="col-md-auto d-flex align-items-center gap-3">
                            <label className="d-flex align-items-center"> 
                                Show &nbsp; 
                                <select 
                                    className="form-select" 
                                    value={pageSize} 
                                    onChange={handlePageSizeChange} 
                                    style={{width:'auto'}}
                                    disabled={isProcessing}
                                > 
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option> 
                                </select> 
                            </label>
                        </div>

                        {/* Search */}
                        <div className="col-md-auto ms-auto d-flex align-items-center gap-3">
                            <select 
                                className="form-select" 
                                value={statusFilter} 
                                onChange={handleStatusFilterChange}
                                disabled={isProcessing}
                                style={{width: '150px'}}
                            >
                                <option value="">All Status</option>
                                <option value="New">New</option>
                                <option value="Reviewed">Reviewed</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                                <option value="Closed">Closed</option>
                            </select>
                            <div className="input-group" style={{ minWidth: '250px' }}>
                                <span className="input-group-text"><Search size={16} /></span>
                                <input
                                    type="search"
                                    value={globalSearch}
                                    onChange={handleFilterChange}
                                    className="form-control"
                                    placeholder="Search feedback..."
                                    disabled={isProcessing}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="table-responsive text-nowrap">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Dealer</th>
                                <th>Content</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="table-border-bottom-0">
                            {paginatedFeedbacks.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-4">
                                    {totalItems === 0 && !globalSearch ? 'No feedbacks found.' : 'No feedbacks match your search.'}
                                </td></tr>
                            ) : (
                                paginatedFeedbacks.map(fb => {
                                    const customerName = customerMap[fb.customerId] || 'N/A';
                                    const dealerName = dealerMap[fb.dealerId] || 'N/A';
                                    return (
                                        <tr key={fb.id}>
                                            {/* Customer */}
                                            <td>
                                                <div className="d-flex justify-content-start align-items-center">
                                                    <div className="avatar avatar-sm me-3"> 
                                                        <span className={`avatar-initial rounded-circle bg-label-secondary`}>
                                                            {getAvatarInitials(customerName)}
                                                        </span> 
                                                    </div>
                                                    <div className="d-flex flex-column">
                                                        <span className="fw-semibold">{customerName}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Dealer */}
                                            <td>{dealerName}</td>
                                            {/* Content */}
                                            <td style={{ whiteSpace: 'normal', minWidth: '300px' }}>
                                                {fb.content ? fb.content.substring(0, 100) + (fb.content.length > 100 ? '...' : '') : 'N/A'}
                                            </td>
                                            {/* Status */}
                                            <td><RenderFeedbackStatus status={fb.status} /></td>
                                            {/* Date */}
                                            <td>{formatDate(fb.createdAt)}</td>
                                            
                                            {/* Actions */}
                                            <td>
                                                <div className="d-flex gap-1">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-icon btn-text-danger rounded-pill"
                                                        title="Delete"
                                                        onClick={() => handleDelete(fb)}
                                                        disabled={isProcessing}
                                                    >
                                                        <Trash size={18} />
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
                                                            <li>
                                                                <button 
                                                                    className="dropdown-item d-flex align-items-center" 
                                                                    onClick={() => handleView(fb)}
                                                                >
                                                                    <Eye size={16} className="me-2" /> View Details
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button 
                                                                    className="dropdown-item d-flex align-items-center" 
                                                                    onClick={() => handleEditStatus(fb)}
                                                                >
                                                                    <Edit size={16} className="me-2" /> Update Status
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
                                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={isProcessing}>&laquo;</button> 
                            </li>
                            <li className="page-item active"><span className="page-link">{currentPage}</span></li>
                            <li className="page-item disabled"><span className="page-link text-muted">of {totalPages}</span></li>
                            <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}> 
                                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={isProcessing}>&raquo;</button> 
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Render Modals */}
            <FeedbackDetailsModal
                show={showViewModal}
                onClose={() => setShowViewModal(false)}
                feedback={viewingFeedback}
                customerMap={customerMap}
                dealerMap={dealerMap}
            />
            
            <FeedbackStatusModal
                show={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                onSave={handleSaveStatus}
                currentStatus={editingFeedback?.status}
            />

            {(showViewModal || showStatusModal) && <div className="modal-backdrop fade show"></div>}
        </>
    );
};

export default FeedbackManagement;