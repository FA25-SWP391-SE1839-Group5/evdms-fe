import React from 'react';

// --- Helper Functions ---
const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
const formatFullDateTime = (isoString) => isoString ? new Date(isoString).toLocaleString('vi-VN', { dateStyle: 'long', timeStyle: 'short' }) : 'N/A';
const formatOrderId = (id) => `#${id?.slice(-6).toUpperCase() || 'N/A'}`;
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


const PaymentDetailsModal = ({ show, onClose, payment, salesOrderMap, customerMap, dealerMap }) => {
    if (!show || !payment) return null;

    const orderDisplay = salesOrderMap[payment.salesOrderId] || 'N/A';
    const orderDetails = salesOrderMap[payment.salesOrderId]; 
    const customerName = customerMap[orderDetails?.customerId] || 'N/A';
    const dealerName = dealerMap[orderDetails?.dealerId] || 'N/A';

    return (
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Payment Details</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        
                        <div className="row mb-3">
                             <div className="col-6">
                                <label className="form-label text-muted">Payment ID</label>
                                <p className="fw-semibold">{formatOrderId(payment.id)}</p> {/* Tái sử dụng formatOrderId */}
                            </div>
                            <div className="col-6">
                                <label className="form-label text-muted">Status</label>
                                <div><RenderPaymentStatus status={payment.status} /></div>
                            </div>
                           
                        </div>

                         <div className="row mb-3">
                             <div className="col-6">
                                <label className="form-label text-muted">Amount</label>
                                <p className="fw-semibold">{formatCurrency(payment.amount)}</p>
                            </div>
                            <div className="col-6">
                                <label className="form-label text-muted">Method</label>
                                <p className="fw-semibold">{payment.method || 'N/A'}</p>
                            </div>
                        </div>

                        <hr/>

                         <div className="mb-3">
                            <label className="form-label text-muted">Sales Order</label>
                            {/* Hiển thị order code thay vì chỉ ID */}
                            <p className="fw-semibold">{orderDetails?.orderCode || formatOrderId(payment.salesOrderId)}</p> 
                        </div>

                         <div className="mb-3">
                            <label className="form-label text-muted">Customer</label>
                            <p className="fw-semibold">{customerName}</p>
                        </div>
                        
                         <div className="mb-3">
                            <label className="form-label text-muted">Dealer</label>
                            <p className="fw-semibold">{dealerName}</p>
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label text-muted">Payment Date</label>
                            <p className="fw-semibold">{formatFullDateTime(payment.createdAt)}</p>
                        </div>

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-label-secondary" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentDetailsModal;