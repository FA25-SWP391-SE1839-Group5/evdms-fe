import React, { useState, useEffect, useMemo } from 'react';
import {
    Search,
    AlertCircle,
    CheckCircle,
    MoreVertical,
    Eye,
    Trash,
    Edit,
    Plus
} from 'lucide-react';
// Import services
import {
    getAllTestDrives,
    createTestDrive,
    updateTestDrive,
    patchTestDrive,
    deleteTestDrive
} from '../../../services/testDriveService';
import { getAllCustomers } from '../../../services/dashboardService';
import { getAllDealers } from '../../../services/dealerService';
import { getAllVehicleVariants } from '../../../services/vehicleService';

import TestDriveStatsCards from './TestDriveStatsCards';
import TestDriveDetailsModal from './TestDriveDetailsModal';
import TestDriveStatusModal from './TestDriveStatusModal';
import TestDriveFormModal from './TestDriveFormModal';

// --- Helper Functions ---
const getAvatarInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length === 1) return name.substring(0, 1).toUpperCase();
    return (parts[0].substring(0, 1) + (parts.length > 1 ? parts[parts.length - 1].substring(0, 1) : '')).toUpperCase();
};

const formatFullDateTime = (isoString) => isoString ? new Date(isoString).toLocaleString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A';

const RenderTestDriveStatus = ({ status }) => {
    let badgeClass = 'secondary';
    const st = String(status).toLowerCase();
    switch (st) {
        case 'scheduled': badgeClass = 'info'; break;
        case 'completed': badgeClass = 'success'; break;
        case 'cancelled': badgeClass = 'danger'; break;
    }
    const capitalizedStatus = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'N/A';
    return <span className={`badge bg-label-${badgeClass}`}>{capitalizedStatus}</span>;
};

const TestDriveManagement = () => {
    const [testDrives, setTestDrives] = useState([]);
    const [customerMap, setCustomerMap] = useState({});
    const [dealerMap, setDealerMap] = useState({});
    const [variantMap, setVariantMap] = useState({});
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Pagination & Filter
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [globalSearch, setGlobalSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dealerFilter, setDealerFilter] = useState('');

    // Modal States
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewingTestDrive, setViewingTestDrive] = useState(null);
    
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [editingStatusTestDrive, setEditingStatusTestDrive] = useState(null);
    
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingTestDrive, setEditingTestDrive] = useState(null); // null: add, object: edit

    // Fetch Data
    const fetchData = async () => {
        try {
            if (!testDrives.length) setLoading(true);
            setError('');

            const [driveRes, customerRes, dealerRes, variantRes] = await Promise.all([
                getAllTestDrives(),
                getAllCustomers(),
                getAllDealers(),
                getAllVehicleVariants() // Giả định hàm này tồn tại
            ]);

            const driveList = driveRes.data?.data?.items || driveRes.data?.items || driveRes.data || [];
            setTestDrives(driveList);

            const customerList = customerRes.data?.data?.items || customerRes.data?.items || customerRes.data || [];
            setCustomerMap(customerList.reduce((acc, c) => { acc[c.id] = c.fullName; return acc; }, {}));
            
            const dealerList = dealerRes.data?.data?.items || dealerRes.data?.items || dealerRes.data || [];
            setDealerMap(dealerList.reduce((acc, d) => { acc[d.id] = d.name; return acc; }, {}));
            
            const variantList = variantRes.data?.data?.items || variantRes.data?.items || variantRes.data || [];
            setVariantMap(variantList.reduce((acc, v) => { acc[v.id] = v.name; return acc; }, {}));

        } catch (err) {
            const errMsg = err.response?.data?.message || err.message || 'Failed to load data';
            setError(errMsg);
            console.error("Fetch Test Drives Error:", err);
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
    const filteredTestDrives = useMemo(() => {
        return testDrives.filter(td => {
            if (dealerFilter && td.dealerId !== dealerFilter) return false;
            
            const status = (td.status || '').toLowerCase();
            if (statusFilter && status !== statusFilter.toLowerCase()) return false;

            const searchLower = globalSearch.toLowerCase();
            if (searchLower) {
                const customerName = (customerMap[td.customerId] || '').toLowerCase();
                const dealerName = (dealerMap[td.dealerId] || '').toLowerCase();
                const variantName = (variantMap[td.variantId] || '').toLowerCase();
                
                return (
                    customerName.includes(searchLower) ||
                    dealerName.includes(searchLower) ||
                    variantName.includes(searchLower) ||
                    status.includes(searchLower)
                );
            }
            return true;
        });
    }, [testDrives, globalSearch, statusFilter, dealerFilter, customerMap, dealerMap, variantMap]);

    // Pagination Logic
    const totalItems = filteredTestDrives.length;
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    const paginatedTestDrives = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredTestDrives.slice(startIndex, startIndex + pageSize);
    }, [filteredTestDrives, currentPage, pageSize]);
    const startEntry = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endEntry = Math.min(currentPage * pageSize, totalItems);

    // --- Handlers ---
    const handleFilterChange = (e) => { setCurrentPage(1); setGlobalSearch(e.target.value); };
    const handleStatusFilterChange = (e) => { setCurrentPage(1); setStatusFilter(e.target.value); };
    const handleDealerFilterChange = (e) => { setCurrentPage(1); setDealerFilter(e.target.value); };
    const handlePageSizeChange = (e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); };
    const handlePageChange = (newPage) => { if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage); };
    
    // View Modal
    const handleView = (td) => {
        setViewingTestDrive(td);
        setShowViewModal(true);
    };

    // Status Modal
    const handleEditStatus = (td) => {
        setEditingStatusTestDrive(td);
        setShowStatusModal(true);
    };
    
    const handleSaveStatus = async (newStatus) => {
        if (!editingStatusTestDrive) return;
        
        setError(''); setSuccess(''); setIsProcessing(true);
        try {
            await patchTestDrive(editingStatusTestDrive.id, { status: newStatus });
            setSuccess('Test drive status updated!');
            await fetchData();
            setShowStatusModal(false);
            setEditingStatusTestDrive(null);
        } catch (err) {
            const errMsg = err.response?.data?.message || 'Failed to update status';
            setError(errMsg);
            throw err;
        } finally {
            setIsProcessing(false);
        }
    };

    // Form Modal (Add/Edit)
    const handleAddNew = () => {
        setEditingTestDrive({}); // {} = Add mode
        setShowFormModal(true);
    };

    const handleEdit = (td) => {
        setEditingTestDrive(td); // object = Edit mode
        setShowFormModal(true);
    };
    
    const handleSaveForm = async (formData) => {
        setError(''); setSuccess(''); setIsProcessing(true);
        try {
            if (formData.id) {
                // Edit (PUT)
                await updateTestDrive(formData.id, formData);
                setSuccess('Test drive updated successfully!');
            } else {
                // Add (POST)
                await createTestDrive(formData);
                setSuccess('Test drive scheduled successfully!');
            }
            await fetchData();
            setShowFormModal(false);
            setEditingTestDrive(null);
        } catch (err) {
            const errMsg = err.response?.data?.message || 'Failed to save test drive';
            setError(errMsg);
            throw err;
        } finally {
            setIsProcessing(false);
        }
    };

    // Delete
    const handleDelete = async (td) => {
        const customerName = customerMap[td.customerId] || 'this booking';
        
        if (window.confirm(`Are you sure you want to delete the test drive for ${customerName}?`)) {
            setIsProcessing(true); setError(''); setSuccess('');
            try {
                await deleteTestDrive(td.id);
                setSuccess('Test drive deleted!');
                await fetchData();
            } catch (err) {
                const errMsg = err.response?.data?.message || 'Failed to delete test drive';
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
            <TestDriveStatsCards testDrives={testDrives} />

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
                        
                        {/* Show & Add (BÊN TRÁI) */}
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
                            <button
                                type="button"
                                className="btn btn-primary d-flex align-items-center"
                                onClick={handleAddNew}
                                disabled={isProcessing}
                            >
                                <Plus size={16} className="me-1" />
                                Add Booking
                            </button>
                        </div>

                        {/* Search & Filter (BÊN PHẢI) */}
                        <div className="col-md-auto ms-auto d-flex align-items-center gap-3">
                            <select 
                                className="form-select" 
                                value={dealerFilter} 
                                onChange={handleDealerFilterChange}
                                disabled={isProcessing}
                                style={{width: '180px'}}
                            >
                                <option value="">All Dealers</option>
                                {Object.entries(dealerMap).map(([id, name]) => (
                                    <option key={id} value={id}>{name}</option>
                                ))}
                            </select>

                            <select 
                                className="form-select" 
                                value={statusFilter} 
                                onChange={handleStatusFilterChange}
                                disabled={isProcessing}
                                style={{width: '150px'}}
                            >
                                <option value="">All Status</option>
                                <option value="Scheduled">Scheduled</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>

                            <div className="input-group" style={{ minWidth: '200px' }}>
                                <span className="input-group-text"><Search size={16} /></span>
                                <input
                                    type="search"
                                    value={globalSearch}
                                    onChange={handleFilterChange}
                                    className="form-control"
                                    placeholder="Search..."
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
                                <th>Vehicle</th>
                                <th>Dealer</th>
                                <th>Scheduled At</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="table-border-bottom-0">
                            {paginatedTestDrives.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-4">
                                    {totalItems === 0 && !globalSearch && !statusFilter && !dealerFilter
                                        ? 'No test drives found.' 
                                        : 'No test drives match your filters.'}
                                </td></tr>
                            ) : (
                                paginatedTestDrives.map(td => {
                                    const customerName = customerMap[td.customerId] || 'N/A';
                                    const dealerName = dealerMap[td.dealerId] || 'N/A';
                                    const variantName = variantMap[td.variantId] || 'N/A';
                                    return (
                                        <tr key={td.id}>
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
                                            <td>{variantName}</td>
                                            <td>{dealerName}</td>
                                            <td>{formatFullDateTime(td.scheduledAt)}</td>
                                            <td><RenderTestDriveStatus status={td.status} /></td>
                                            
                                            {/* Actions */}
                                            <td>
                                                <div className="d-flex gap-1">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-icon btn-text-danger rounded-pill"
                                                        title="Delete"
                                                        onClick={() => handleDelete(td)}
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
                                                            <li>
                                                                <button 
                                                                    className="dropdown-item d-flex align-items-center" 
                                                                    onClick={() => handleView(td)}
                                                                >
                                                                   <i className="bx bx-show me-2" /> View Details
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button 
                                                                    className="dropdown-item d-flex align-items-center" 
                                                                    onClick={() => handleEdit(td)}
                                                                >
                                                                   <i className="bx bx-edit-alt me-2" /> Edit Booking
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button 
                                                                    className="dropdown-item d-flex align-items-center" 
                                                                    onClick={() => handleEditStatus(td)}
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
            <TestDriveDetailsModal
                show={showViewModal}
                onClose={() => setShowViewModal(false)}
                testDrive={viewingTestDrive}
                customerMap={customerMap}
                dealerMap={dealerMap}
                variantMap={variantMap}
            />
            
            <TestDriveStatusModal
                show={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                onSave={handleSaveStatus}
                currentStatus={editingStatusTestDrive?.status}
            />

            <TestDriveFormModal
                show={showFormModal}
                onClose={() => {setShowFormModal(false); setEditingTestDrive(null);}}
                onSave={handleSaveForm}
                testDrive={editingTestDrive}
                customerMap={customerMap}
                dealerMap={dealerMap}
                variantMap={variantMap}
            />

            {(showViewModal || showStatusModal || showFormModal) && <div className="modal-backdrop fade show"></div>}
        </>
    );
};

export default TestDriveManagement;