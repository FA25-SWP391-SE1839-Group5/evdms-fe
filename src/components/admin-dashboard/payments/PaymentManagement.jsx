import React, { useState, useEffect, useMemo } from 'react';
import {
    Search, AlertCircle, CheckCircle, MoreVertical, Eye, Trash, Edit, Plus, Filter 
} from 'lucide-react';

import { getAllPayments, createPayment, updatePayment, patchPayment, deletePayment } from '../../../services/paymentService';
import { getAllCustomers } from '../../../services/dashboardService';
import { getAllDealers } from '../../../services/dealerService';
import { getAllSalesOrders } from '../../../services/orderService'; 

import PaymentStatsCards from './PaymentStatsCards';
import PaymentDetailsModal from './PaymentDetailsModal';
import PaymentStatusModal from './PaymentStatusModal';
import PaymentFormModal from './PaymentFormModal';
import PaymentFilterPanel from './PaymentFilterPanel'; 

// --- Helper Functions ---
const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
const formatOrderId = (id) => `#${id?.slice(-6).toUpperCase() || 'N/A'}`;
const formatShortDate = (isoString) => isoString ? new Date(isoString).toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' }) : 'N/A';
const RenderPaymentStatus = ({ status }) => {
    let badgeClass = 'secondary';
    const st = String(status).toLowerCase();
    switch (st) {
        case 'pending': badgeClass = 'warning'; break;
        case 'completed': badgeClass = 'success'; break;
        case 'failed': badgeClass = 'danger'; break;
        case 'cancelled': badgeClass = 'secondary'; break;
    }
    const capitalizedStatus = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'N/A';
    return <span className={`badge bg-label-${badgeClass}`}>{capitalizedStatus}</span>;
};
// --- End Helper Functions ---

const PaymentManagement = () => {
    const [payments, setPayments] = useState([]);
    const [customerMap, setCustomerMap] = useState({});
    const [dealerMap, setDealerMap] = useState({});
    const [salesOrderMap, setSalesOrderMap] = useState({}); // { id: { orderCode: '#SO123', customerId: '...', dealerId: '...' } }
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Pagination & Filter
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [globalSearch, setGlobalSearch] = useState('');
    const [activeFilters, setActiveFilters] = useState({
        dealerId: '', status: '', customerId: '', salesOrderId: '', startDate: '', endDate: '', method: ''
    });
    const [showFilterPanel, setShowFilterPanel] = useState(false); 

    // Modal States
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewingPayment, setViewingPayment] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [editingStatusPayment, setEditingStatusPayment] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingPayment, setEditingPayment] = useState(null); 

    // Fetch Data
    const fetchData = async () => {
        try {
            if (!payments.length) setLoading(true);
            setError('');

            const [paymentRes, customerRes, dealerRes, orderRes] = await Promise.all([
                getAllPayments(), getAllCustomers(), getAllDealers(), getAllSalesOrders() // Fetch orders
            ]);

            const paymentList = paymentRes.data?.data?.items || paymentRes.data?.items || paymentRes.data || [];
            setPayments(paymentList);

            const customerList = customerRes.data?.data?.items || customerRes.data?.items || customerRes.data || [];
            setCustomerMap(customerList.reduce((acc, c) => { acc[c.id] = c.fullName; return acc; }, {}));
            
            const dealerList = dealerRes.data?.data?.items || dealerRes.data?.items || dealerRes.data || [];
            setDealerMap(dealerList.reduce((acc, d) => { acc[d.id] = d.name; return acc; }, {}));
            
            // Xử lý Sales Order Map (điều chỉnh key/value tùy theo cấu trúc API của cậu)
            const orderList = orderRes.data?.data?.items || orderRes.data?.items || orderRes.data || [];
            setSalesOrderMap(orderList.reduce((acc, order) => {
                 // Format hiển thị cho dropdown (ví dụ)
                const customerName = customerMap[order.customerId] || 'Unknown Customer';
                acc[order.id] = {
                    display: `${formatOrderId(order.id)} - ${customerName}`, // Dùng cho Form Modal dropdown
                    orderCode: formatOrderId(order.id), // Dùng cho View Modal
                    customerId: order.customerId,
                    dealerId: order.dealerId
                }; 
                return acc;
            }, {}));

        } catch (err) {
            const errMsg = err.response?.data?.message || err.message || 'Failed to load data';
            setError(errMsg);
            console.error("Fetch Payments Error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data ban đầu và fetch lại khi customerMap thay đổi (để cập nhật salesOrderMap display)
    useEffect(() => {
        fetchData();
    }, [customerMap]); // Chạy lại fetchData nếu customerMap thay đổi

    // Auto-hide alerts
    useEffect(() => { if (error || success) { const timer = setTimeout(() => { setError(''); setSuccess(''); }, 5000); return () => clearTimeout(timer); } }, [error, success]);

    // Filter Logic
    const filteredPayments = useMemo(() => {
        const startDateFilter = activeFilters.startDate ? new Date(activeFilters.startDate) : null;
        if (startDateFilter) startDateFilter.setHours(0, 0, 0, 0); 
        const endDateFilter = activeFilters.endDate ? new Date(activeFilters.endDate) : null;
        if (endDateFilter) endDateFilter.setHours(23, 59, 59, 999); 

        return payments.filter(p => {
            const orderDetails = salesOrderMap[p.salesOrderId];
            
            // Filter Panel
            if (activeFilters.status && p.status !== activeFilters.status) return false;
            if (activeFilters.method && p.method !== activeFilters.method) return false;
            if (activeFilters.salesOrderId && p.salesOrderId !== activeFilters.salesOrderId) return false;
            if (activeFilters.customerId && orderDetails?.customerId !== activeFilters.customerId) return false;
            if (activeFilters.dealerId && orderDetails?.dealerId !== activeFilters.dealerId) return false;

            // Date Range (dựa trên createdAt của payment)
            if (startDateFilter || endDateFilter) {
                const paymentDate = new Date(p.createdAt);
                if (startDateFilter && paymentDate < startDateFilter) return false;
                if (endDateFilter && paymentDate > endDateFilter) return false;
            }

            // Search
            const searchLower = globalSearch.toLowerCase();
            if (searchLower) {
                const customerName = customerMap[orderDetails?.customerId]?.toLowerCase() || '';
                const dealerName = dealerMap[orderDetails?.dealerId]?.toLowerCase() || '';
                const orderCode = orderDetails?.orderCode?.toLowerCase() || '';
                const method = (p.method || '').toLowerCase();
                const status = (p.status || '').toLowerCase();
                const amountStr = String(p.amount);
                
                return (
                    orderCode.includes(searchLower) ||
                    customerName.includes(searchLower) ||
                    dealerName.includes(searchLower) ||
                    method.includes(searchLower) ||
                    status.includes(searchLower) ||
                    amountStr.includes(searchLower)
                );
            }
            return true;
        });
    }, [payments, globalSearch, activeFilters, customerMap, dealerMap, salesOrderMap]);

    // Pagination Logic
    const totalItems = filteredPayments.length;
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    const paginatedPayments = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredPayments.slice(startIndex, startIndex + pageSize);
    }, [filteredPayments, currentPage, pageSize]);
    const startEntry = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endEntry = Math.min(currentPage * pageSize, totalItems);

    // --- Handlers ---
    const handleFilterChange = (e) => { setCurrentPage(1); setGlobalSearch(e.target.value); };
    const handlePageSizeChange = (e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); };
    const handlePageChange = (newPage) => { if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage); };
    const handleApplyFilters = (newFilters) => { setCurrentPage(1); setActiveFilters(newFilters); setShowFilterPanel(false); };

    // Modals
    const handleView = (p) => { setViewingPayment(p); setShowViewModal(true); };
    const handleEditStatus = (p) => { setEditingStatusPayment(p); setShowStatusModal(true); };
    const handleAddNew = () => { setEditingPayment({}); setShowFormModal(true); };
    const handleEdit = (p) => { setEditingPayment(p); setShowFormModal(true); };

    const handleSaveStatus = async (newStatus) => {
        if (!editingStatusPayment) return;
        setError(''); setSuccess(''); setIsProcessing(true);
        try {
            await patchPayment(editingStatusPayment.id, { status: newStatus });
            setSuccess('Payment status updated!');
            await fetchData();
            setShowStatusModal(false); setEditingStatusPayment(null);
        } catch (err) { setError(err.response?.data?.message || 'Failed to update status'); throw err; } 
        finally { setIsProcessing(false); }
    };

    const handleSaveForm = async (formData) => {
        setError(''); setSuccess(''); setIsProcessing(true);
        try {
            // Chuyển amount thành số trước khi gửi
            const dataToSend = { ...formData, amount: parseFloat(formData.amount) };

            if (formData.id) { await updatePayment(formData.id, dataToSend); setSuccess('Payment updated!'); } 
            else { await createPayment(dataToSend); setSuccess('Payment created!'); }
            await fetchData();
            setShowFormModal(false); setEditingPayment(null);
        } catch (err) { setError(err.response?.data?.message || 'Failed to save payment'); throw err; } 
        finally { setIsProcessing(false); }
    };

    const handleDelete = async (p) => {
        if (window.confirm(`Delete payment ${formatOrderId(p.id)} for ${formatCurrency(p.amount)}?`)) {
            setIsProcessing(true); setError(''); setSuccess('');
            try {
                await deletePayment(p.id);
                setSuccess('Payment deleted!');
                await fetchData();
            } catch (err) { setError(err.response?.data?.message || 'Failed to delete'); } 
            finally { setIsProcessing(false); }
        }
    };
    
    // --- Render ---
    // Tạo salesOrderMap cho Form Modal dropdown
    const salesOrderOptionsMap = useMemo(() => {
        return Object.entries(salesOrderMap).reduce((acc, [id, details]) => {
            acc[id] = details.display; // Chỉ lấy ID và display string
            return acc;
        }, {});
    }, [salesOrderMap]);

    if (loading) { 
        return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-primary"></div></div>; 
    }

     // Đếm số filter đang active
    const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

    return (
        <>
            <PaymentStatsCards payments={payments} />

            {error && 
                <div className="alert alert-danger alert-dismissible d-flex align-items-center mb-4">
                    <AlertCircle size={20} className="me-2" />
                    <div className="flex-grow-1">{error}</div>
                    <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setError('')}
                    ></button>
                </div>}
            {success && 
                <div className="alert alert-success alert-dismissible d-flex align-items-center mb-4">
                    <CheckCircle size={20} className="me-2" />
                    <div className="flex-grow-1">{success}</div>
                    <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setSuccess('')}
                        ></button></div>}

            <div className="card">
                <div className="card-header border-bottom">
                    <div className="d-flex justify-content-between align-items-center row py-3 gap-3 gap-md-0">
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
                                <Plus size={16} className="me-1" /> Create Payment
                            </button>
                        </div>
                        <div className="col-md-auto ms-auto d-flex align-items-center gap-3">
                            <button 
                                type="button" 
                                className="btn btn-outline-secondary d-flex align-items-center position-relative" 
                                onClick={() => setShowFilterPanel(true)} 
                                disabled={isProcessing}
                            >
                                <Filter size={16} className="me-1" /> Filters
                                {activeFilterCount > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{activeFilterCount}</span>}
                            </button>
                            <div className="input-group" style={{ minWidth: '200px' }}>
                                <span className="input-group-text"><Search size={16} /></span>
                                <input 
                                    type="search" 
                                    value={globalSearch} 
                                    onChange={handleFilterChange} 
                                    className="form-control" 
                                    placeholder="Search..." disabled={isProcessing} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="table-responsive text-nowrap">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Payment ID</th>
                                <th>Order</th>
                                <th>Customer</th>
                                <th>Dealer</th>
                                <th>Amount</th>
                                <th>Method</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="table-border-bottom-0">
                            {paginatedPayments.length === 0 ? (
                                <tr><td colSpan="9" className="text-center py-4">{totalItems === 0 && !globalSearch && activeFilterCount === 0 ? 'No payments found.' : 'No payments match filters.'}</td></tr>
                            ) : (
                                paginatedPayments.map(p => {
                                    const orderDetails = salesOrderMap[p.salesOrderId];
                                    const customerName = customerMap[orderDetails?.customerId] || 'N/A';
                                    const dealerName = dealerMap[orderDetails?.dealerId] || 'N/A';
                                    return (
                                        <tr key={p.id}>
                                            <td><span className="fw-semibold text-primary">{formatOrderId(p.id)}</span></td>
                                            <td>{orderDetails?.orderCode || formatOrderId(p.salesOrderId)}</td>
                                            <td>{customerName}</td>
                                            <td>{dealerName}</td>
                                            <td>{formatCurrency(p.amount)}</td>
                                            <td>{p.method}</td>
                                            <td>{formatShortDate(p.createdAt)}</td>
                                            <td><RenderPaymentStatus status={p.status} /></td>
                                            <td>
                                                <div className="d-flex gap-1">
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-sm btn-icon btn-text-danger rounded-pill" title="Delete" 
                                                        onClick={() => handleDelete(p)} 
                                                        disabled={isProcessing}
                                                    >
                                                        <i className="bx bx-trash" />
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-sm btn-icon btn-text-secondary rounded-pill" title="Update Status" 
                                                        onClick={() => handleEditStatus(p)} 
                                                        disabled={isProcessing}
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <div className="dropdown">
                                                        <button 
                                                            type="button" 
                                                            className="btn p-0 dropdown-toggle hide-arrow btn-sm" data-bs-toggle="dropdown" 
                                                            aria-expanded="false" 
                                                            disabled={isProcessing}
                                                        >
                                                            <MoreVertical size={18} />
                                                        </button>
                                                        <div className="dropdown-menu dropdown-menu-end">
                                                            <li>
                                                                <button 
                                                                    className="dropdown-item d-flex align-items-center" 
                                                                    onClick={() => handleView(p)}
                                                                >
                                                                    <Eye size={16} className="me-2" /> View Details
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button 
                                                                    className="dropdown-item d-flex align-items-center" 
                                                                    onClick={() => handleEdit(p)}
                                                                >
                                                                    <i className="bx bx-edit-alt me-2" /> Edit Payment
                                                                </button>
                                                            </li>
                                                        </div>
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

                <div className="d-flex justify-content-between align-items-center p-3 border-top">
                    <small className="text-muted">Showing {startEntry} to {endEntry} of {totalItems} entries</small>
                     <nav>
                        <ul className="pagination pagination-sm mb-0">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button 
                                    className="page-link" 
                                    onClick={() => handlePageChange(currentPage - 1)} 
                                    disabled={isProcessing}
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
                                    disabled={isProcessing}
                                >
                                    &raquo;
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Render Modals & Panel */}
            <PaymentDetailsModal 
                show={showViewModal} 
                onClose={() => setShowViewModal(false)} 
                payment={viewingPayment} 
                salesOrderMap={salesOrderMap} 
                customerMap={customerMap} 
                dealerMap={dealerMap} 
            />

            <PaymentStatusModal 
                show={showStatusModal} 
                onClose={() => setShowStatusModal(false)} 
                onSave={handleSaveStatus} 
                currentStatus={editingStatusPayment?.status} 
            />

            <PaymentFormModal 
                show={showFormModal} 
                onClose={() => {setShowFormModal(false); setEditingPayment(null);}} 
                onSave={handleSaveForm} 
                payment={editingPayment} 
                salesOrderMap={salesOrderOptionsMap} 
            />

            <PaymentFilterPanel 
                show={showFilterPanel} 
                onClose={() => setShowFilterPanel(false)} 
                onApplyFilters={handleApplyFilters} 
                currentFilters={activeFilters} 
                dealerMap={dealerMap} 
                customerMap={customerMap} 
                salesOrderMap={salesOrderOptionsMap} 
            />
            {(showViewModal || showStatusModal || showFormModal || showFilterPanel) && <div className="modal-backdrop fade show"></div>}
        </>
    );
};

export default PaymentManagement;