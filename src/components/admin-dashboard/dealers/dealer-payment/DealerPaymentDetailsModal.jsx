import React from 'react';

const formatPaymentId = (id) => `#${id?.slice(-6).toUpperCase() || 'N/A'}`;
const formatDate = (isoString) => isoString ? new Date(isoString).toLocaleString('en-GB') : 'N/A';
const formatCurrency = (amount) => typeof amount === 'number' ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount) : 'N/A';

const RenderPaymentStatus = ({ status }) => {
    let badgeClass = 'secondary';
    switch (status?.toLowerCase()) {
        case 'pending': badgeClass = 'warning'; break;
        case 'paid': badgeClass = 'success'; break;
        case 'failed': badgeClass = 'danger'; break;
    }
    return <span className={`badge rounded-pill bg-label-${badgeClass} d-flex align-items-center p-1 px-2`}><span className={`dot bg-${badgeClass} me-1`}></span> {status || 'N/A'}</span>;
};
// --- Hết phần Helpers ---


export default function DealerPaymentDetailsModal({ show, onClose, payment, dealerName }) {
    if (!show || !payment) {
        return null;
    }

    return (
        <>
            {/* Backdrop */}
            <div className="modal-backdrop fade show" onClick={onClose}></div>
            
            {/* Modal */}
            <div 
                className="modal fade show" 
                id="paymentViewModal" 
                tabIndex="-1" 
                style={{ display: 'block' }} 
                aria-modal="true" 
                role="dialog"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        
                        {/* Header */}
                        <div className="modal-header">
                            <h5 className="modal-title" id="paymentViewModalLabel">
                                Payment Details: <span className="text-primary fw-semibold">{formatPaymentId(payment.id)}</span>
                            </h5>
                            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                        </div>
                        
                        {/* Body */}
                        <div className="modal-body">
                            <dl className="row g-2">
                                <dt className="col-sm-4">Status</dt>
                                <dd className="col-sm-8"><RenderPaymentStatus status={payment.status} /></dd>

                                <dt className="col-sm-4">Amount</dt>
                                <dd className="col-sm-8 fw-semibold">{formatCurrency(payment.amount)}</dd>

                                <dt className="col-sm-4">Dealer</dt>
                                <dd className="col-sm-8">{dealerName || 'N/A'}</dd>

                                <dt className="col-sm-4">Payment Method</dt>
                                <dd className="col-sm-8">{payment.paymentMethod || 'N/A'}</dd>
                                
                                <dt className="col-sm-4">Related Order</dt>
                                <dd className="col-sm-8">{payment.dealerOrderId ? formatPaymentId(payment.dealerOrderId) : 'N/A'}</dd>

                                <dt className="col-sm-4">Date Created</dt>
                                <dd className="col-sm-8">{formatDate(payment.createdAt)}</dd>

                                <dt className="col-sm-4">Last Updated</dt>
                                <dd className="col-sm-8">{formatDate(payment.updatedAt)}</dd>
                                
                                <dt className="col-sm-4">Notes</dt>
                                <dd className="col-sm-8 fst-italic">{payment.notes || '—'}</dd>
                            </dl>
                        </div>
                        
                        {/* Footer */}
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}