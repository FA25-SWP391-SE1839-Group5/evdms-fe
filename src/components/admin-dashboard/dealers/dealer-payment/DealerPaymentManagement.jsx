import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AlertCircle, CheckCircle, Plus, Edit, Trash, Check, X, Upload } from 'lucide-react';
import {
    getAllDealerPayments,
    deleteDealerPayment,
    markPaymentPaid,
    markPaymentFailed,
    uploadDealerPaymentDocument,
    getAllDealers,
} from '../../../../services/dealerService';
import DealerPaymentModal from './DealerPaymentModal';
import DealerPaymentStatsCards from './DealerPaymentStatsCards';
import DealerPaymentDetailsModal from './DealerPaymentDetailsModal';

// --- Helper Functions ---
const formatPaymentId = (id) => `#${id?.slice(-6).toUpperCase() || 'N/A'}`;
const formatDate = (isoString) => isoString ? new Date(isoString).toLocaleString('en-GB') : 'N/A';
const formatCurrency = (amount) => typeof amount === 'number' ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount) : 'N/A';

const RenderPaymentStatus = ({ status }) => {
    let badgeClass = 'secondary';
    let icon = null; // Optional icon
    switch (status?.toLowerCase()) {
        case 'pending': badgeClass = 'warning'; icon = <Clock size={14} className="me-1"/>; break;
        case 'paid': badgeClass = 'success'; icon = <CheckCircle size={14} className="me-1"/>; break;
        case 'failed': badgeClass = 'danger'; icon = <XCircle size={14} className="me-1"/>; break;
    }
    // Mimic invoice list style
    return <span className={`badge rounded-pill bg-label-${badgeClass} d-flex align-items-center p-1 px-2`}><span className={`dot bg-${badgeClass} me-1`}></span> {status || 'N/A'}</span>;

    // Original badge style:
    // return <span className={`badge bg-label-${badgeClass}`}>{status || 'N/A'}</span>;
};

export default function DealerPaymentManagement() {
    const [payments, setPayments] = useState([]);
    const [dealers, setDealers] = useState([]);
    const [dealerMap, setDealerMap] = useState({});
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showFormModal, setShowFormModal] = useState(false);
    const [paymentToEdit, setPaymentToEdit] = useState(null);

    const [showViewModal, setShowViewModal] = useState(false);
    const [paymentToView, setPaymentToView] = useState(null);

    // Pagination & Filter State
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState(''); // Filter dropdown
    const [globalSearch, setGlobalSearch] = useState(''); // Search input

    const [paymentIdForUpload, setPaymentIdForUpload] = useState(null);
    const fileInputRef = useRef(null);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingData(true);
                setError('');
                const [paymentsRes, dealersRes] = await Promise.all([
                    getAllDealerPayments(),
                    getAllDealers(),
                ]);
                setPayments(paymentsRes.data?.data?.items || paymentsRes.data?.items || paymentsRes.data || []);
                const dealerList = dealersRes.data?.data?.items || dealersRes.data?.items || dealersRes.data || [];
                setDealers(dealerList);
                const dMap = dealerList.reduce((acc, d) => { acc[d.id] = d.name; return acc; }, {});
                setDealerMap(dMap);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to load page data');
            } finally {
                setLoadingData(false);
            }
        };
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
    const filteredPayments = useMemo(() => {
        return payments.filter(p => {
            const dealerName = (dealerMap[p.dealerId] || '').toLowerCase();
            const amount = String(p.amount || '').toLowerCase();
            const method = (p.paymentMethod || '').toLowerCase();
            const status = (p.status || '').toLowerCase();
            const date = formatDate(p.createdAt || p.updatedAt).toLowerCase();
            const id = formatPaymentId(p.id).toLowerCase();

            // Status filter first
            if (statusFilter && status !== statusFilter.toLowerCase()) {
                return false;
            }
            // Global search
            if (globalSearch) {
                const searchLower = globalSearch.toLowerCase();
                if (
                    !id.includes(searchLower) &&
                    !dealerName.includes(searchLower) &&
                    !amount.includes(searchLower) &&
                    !method.includes(searchLower) &&
                    !date.includes(searchLower)
                    // Don't search status text here, use filter dropdown
                ) {
                    return false;
                }
            }
            return true; // Passed filters
        });
    }, [payments, dealerMap, statusFilter, globalSearch]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredPayments.length / pageSize);
    const paginatedPayments = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredPayments.slice(startIndex, startIndex + pageSize);
    }, [filteredPayments, currentPage, pageSize]);
    const startEntry = filteredPayments.length > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endEntry = Math.min(currentPage * pageSize, filteredPayments.length);

    // --- Handlers ---
    const reloadPayments = async () => {
         try {
            const paymentsRes = await getAllDealerPayments();
            setPayments(paymentsRes.data?.data?.items || paymentsRes.data?.items || paymentsRes.data || []);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to reload payments');
        }
    }
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setCurrentPage(1);
        if (name === 'globalSearch') setGlobalSearch(value);
        if (name === 'statusFilter') setStatusFilter(value);
    };
    const handlePageSizeChange = (e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); };
    const handleAdd = () => { setPaymentToEdit(null); setShowFormModal(true); };
    const handleSaveSuccess = (isEdit) => {
        setShowFormModal(false);
        setPaymentToEdit(null);
        setSuccess(isEdit ? 'Payment updated successfully!' : 'Payment created successfully!');
        reloadPayments(); // Reload data
    };
    const handleEdit = (paymentId) => {
        const payment = payments.find(p => p.id === paymentId);
        if (payment) { setPaymentToEdit(payment); setShowFormModal(true); }
    };
    const handleDelete = async (paymentId) => {
        const payId = formatPaymentId(paymentId);
        if (!window.confirm(`Are you sure you want to delete Payment ${payId}?`)) return;
        try {
            await deleteDealerPayment(paymentId);
            setSuccess(`Payment ${payId} deleted successfully.`);
            reloadPayments();
        } catch (err) { setError(err.response?.data?.message || 'Failed to delete payment'); }
    };
    const handleMarkPaid = async (paymentId) => {
        if (!window.confirm(`Mark Payment ${formatPaymentId(paymentId)} as PAID?`)) return;
        try {
            await markPaymentPaid(paymentId);
            setSuccess(`Payment ${formatPaymentId(paymentId)} marked as Paid.`);
            reloadPayments();
        } catch (err) { setError(err.response?.data?.message || 'Failed to mark as paid'); }
    };
    const handleMarkFailed = async (paymentId) => {
        if (!window.confirm(`Mark Payment ${formatPaymentId(paymentId)} as FAILED?`)) return;
         try {
            await markPaymentFailed(paymentId);
            setSuccess(`Payment ${formatPaymentId(paymentId)} marked as Failed.`);
            reloadPayments();
        } catch (err) { setError(err.response?.data?.message || 'Failed to mark as failed'); }
    };

    // Handler View
    const handleView = (paymentId) => {
        const payment = payments.find(p => p.id === paymentId);
        if (payment) { setPaymentToView(payment); setShowViewModal(true); }
    };

    const handleUploadClick = (paymentId) => {
        setPaymentIdForUpload(paymentId); // Lưu ID của payment cần upload
        fileInputRef.current.click(); // Kích hoạt input file ẩn
    };

    const handleFileSelected = async (event) => {
        const file = event.target.files[0];
        
        // Kiểm tra nếu không có file hoặc không có ID đã lưu
        if (!file || !paymentIdForUpload) {
            if(fileInputRef.current) fileInputRef.current.value = null;
            setPaymentIdForUpload(null);
            return; 
        }

        const payId = formatPaymentId(paymentIdForUpload);
        
        // Hiển thị loading (nếu muốn)
        // setLoadingData(true); // Cân nhắc dùng 1 state loading riêng
        setSuccess(`Uploading ${file.name} for ${payId}...`);
        
        try {
            await uploadDealerPaymentDocument(paymentIdForUpload, file);
            setSuccess(`Document uploaded successfully for ${payId}.`);
            // reloadPayments(); // Tải lại list nếu cần
        } catch (err) {
            console.error("Upload failed:", err);
            setError(err.response?.data?.message || 'Failed to upload document');
        } finally {
            // Reset state và input file
            // setLoadingData(false);
            setPaymentIdForUpload(null);
            if(fileInputRef.current) {
                fileInputRef.current.value = null; // Reset để có thể upload file y hệt lần nữa
            }
        }
    };

    if (loadingData) {
        return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
    }

    return (
        <>
            {/* Stats Cards */}
            <DealerPaymentStatsCards payments={payments} />

            {/* Alert Message */}
            {error && ( /* ... error alert ... */ 
                <div className="alert alert-danger alert-dismissible d-flex align-items-center mb-4" role="alert">
                    <AlertCircle size={20} className="me-2" /><div className="flex-grow-1">{error}</div>
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
            )}
            {success && ( /* ... success alert ... */ 
                <div className="alert alert-success alert-dismissible d-flex align-items-center mb-4" role="alert">
                    <CheckCircle size={20} className="me-2" /><div className="flex-grow-1">{success}</div>
                    <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
                </div>
            )}

            <div className="card">
                {/* Header: Show, Create, Search, Filter */}
                <div className="card-header border-bottom">
                    <div className="d-flex justify-content-between align-items-center row py-3 gap-3 gap-md-0">

                        {/* Left: Show Entries & Create */}
                        <div className="col-md-auto d-flex align-items-center gap-2">
                            <label className="d-flex align-items-center">
                                Show&nbsp;
                                <select 
                                    className="form-select" 
                                    value={pageSize} 
                                    onChange={handlePageSizeChange} 
                                    style={{width:'auto'}}
                                >
                                    <option>10</option>
                                    <option>25</option>
                                    <option>50</option>
                                    <option>100</option>
                                </select>
                            </label>
                             <button 
                                className="btn btn-primary d-flex align-items-center" 
                                type="button" 
                                onClick={handleAdd}
                            >
                                <Plus size={18} className="me-1"/> Create Payment
                            </button>
                        </div>

                        {/* Right: Search & Status Filter */}
                        <div className="col-md-4 ms-auto d-flex align-items-center gap-2">
                             <input
                                type="search"
                                name="globalSearch"
                                value={globalSearch}
                                onChange={handleFilterChange}
                                className="form-control"
                                placeholder="Search..."
                            />
                             <select
                                name="statusFilter"
                                className="form-select"
                                value={statusFilter}
                                onChange={handleFilterChange}
                             >
                                <option value="">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Failed">Failed</option>
                                {/* Add other statuses if needed */}
                             </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="table-responsive text-nowrap">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Status</th>
                                <th>Dealer</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Method</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="table-border-bottom-0">
                            {paginatedPayments.length === 0 ? (
                                <tr><td colSpan="8" className="text-center py-4">
                                    {filteredPayments.length === 0 && !globalSearch && !statusFilter ? 'No payments found' : 'No payments match filters'}
                                </td></tr>
                            ) : (
                                paginatedPayments.map(p => (
                                    <tr key={p.id}>
                                        <td><span className="fw-semibold text-primary">{formatPaymentId(p.id)}</span></td>
                                        <td><RenderPaymentStatus status={p.status} /></td>
                                        <td>{dealerMap[p.dealerId] || 'N/A'}</td>
                                        <td>{formatCurrency(p.amount)}</td>
                                        <td>{formatDate(p.createdAt || p.updatedAt)}</td>
                                        <td>{p.paymentMethod}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                {/* 1. Delete Button */}
                                                <button 
                                                    type="button" 
                                                    className="btn btn-icon btn-text-secondary rounded-pill btn-sm"
                                                    data-bs-toggle="tooltip" 
                                                    title="Delete"
                                                    onClick={() => handleDelete(p.id)}
                                                >
                                                    <i className="bx bx-trash" />
                                                </button>

                                                {/* View Button */}
                                                <button 
                                                    type="button" 
                                                    className="btn btn-icon btn-text-secondary rounded-pill btn-sm"
                                                    data-bs-toggle="tooltip" 
                                                    title="View"
                                                    onClick={() => handleView(p.id)}
                                                >
                                                    <i className="bx bx-show" /> 
                                                </button>

                                                {/*  Menu Buttons */}
                                                <div className="dropdown">
                                                    <button 
                                                        type="button" 
                                                        className="btn p-0 dropdown-toggle hide-arrow btn-sm" 
                                                        data-bs-toggle="dropdown"
                                                    >
                                                        <i className="bx bx-dots-vertical-rounded" />
                                                    </button>
                                                    <div className="dropdown-menu">
                                                        <button 
                                                            type="button" 
                                                            className="dropdown-item" 
                                                            onClick={() => handleEdit(p.id)}
                                                        >
                                                            <i className="bx bx-edit-alt me-2" /> Edit
                                                        </button>
                                                        <button
                                                            type="button" 
                                                            className="dropdown-item" 
                                                            onClick={() => handleUploadClick(p.id)}
                                                        >
                                                            <Upload size={16} className="me-1"/> Upload Document
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="dropdown-menu">
                                                    {p.status?.toLowerCase() === 'pending' && (
                                                        <>
                                                            <button className="dropdown-item" onClick={() => handleMarkPaid(p.id)}>
                                                                <Check size={16} className="me-1 text-success"/> Mark Paid
                                                            </button>
                                                             <button className="dropdown-item" onClick={() => handleMarkFailed(p.id)}>
                                                                <X size={16} className="me-1 text-danger"/> Mark Failed
                                                            </button>
                                                            <li><hr className="dropdown-divider" /></li>
                                                        </>
                                                    )}
                                                    <button className="dropdown-item" onClick={() => handleEdit(p.id)}>
                                                        <Edit size={16} className="me-1"/> Edit
                                                    </button>
                                                    <button className="dropdown-item text-danger" onClick={() => handleDelete(p.id)}>
                                                        <Trash size={16} className="me-1"/> Delete
                                                    </button>
                                                    {/* Add View/Document actions later if needed */}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="d-flex justify-content-between align-items-center p-3">
                    <small className="text-muted">Showing {startEntry} to {endEntry} of {filteredPayments.length} entries</small>
                    <nav>
                        <ul className="pagination pagination-sm mb-0">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(p=>p-1)} disabled={currentPage === 1}>&laquo;</button>
                            </li>
                            <li className="page-item active"><span className="page-link">{currentPage}</span></li>
                            <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(p=>p+1)} disabled={currentPage >= totalPages}>&raquo;</button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelected}
                style={{ display: 'none' }}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" // Giới hạn loại file (tùy chọn)
            />

            {/* Modal */}
            <DealerPaymentModal
                show={showFormModal}
                onClose={() => { setShowFormModal(false); setPaymentToEdit(null); }}
                onSaveSuccess={handleSaveSuccess}
                dealers={dealers}
                paymentToEdit={paymentToEdit}
            />

            <DealerPaymentDetailsModal
                show={showViewModal}
                onClose={() => { setShowViewModal(false); setPaymentToView(null); }}
                payment={paymentToView}
                dealerName={paymentToView ? dealerMap[paymentToView.dealerId] : ''}
            />
        </>
    )
}
