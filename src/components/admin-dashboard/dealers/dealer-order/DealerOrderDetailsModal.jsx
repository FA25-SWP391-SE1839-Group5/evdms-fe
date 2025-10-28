import React from 'react';

const formatOrderId = (id) => `#${id?.slice(-6).toUpperCase() || 'N/A'}`;
const formatDate = (isoString) => isoString ? new Date(isoString).toLocaleString('en-GB') : 'N/A';

const RenderOrderStatus = ({ status }) => {
    let badgeClass = 'secondary'; // Default
    switch (status?.toLowerCase()) {
        case 'pending': badgeClass = 'warning'; break;
        case 'processing': badgeClass = 'info'; break;
        case 'shipped': badgeClass = 'primary'; break;
        case 'delivered': badgeClass = 'success'; break;
        case 'cancelled': badgeClass = 'danger'; break;
    }
    return <span className={`badge bg-label-${badgeClass}`}>{status || 'N/A'}</span>;
};
// --- Hết phần Helpers ---


export default function DealerOrderDetailsModal({ show, onClose, order, dealerName, variantName }) {
    if (!show || !order) {
        return null;
    }

    return (
        <>
            {/* Backdrop */}
            <div className="modal-backdrop fade show" onClick={onClose}></div>
            
            {/* Modal */}
            <div 
                className="modal fade show" 
                id="orderViewModal" 
                tabIndex="-1" 
                style={{ display: 'block' }} 
                aria-modal="true" 
                role="dialog"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        
                        {/* Header */}
                        <div className="modal-header">
                            <h5 className="modal-title" id="orderViewModalLabel">
                                Order Details: <span className="text-primary fw-semibold">{formatOrderId(order.id)}</span>
                            </h5>
                            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                        </div>
                        
                        {/* Body */}
                        <div className="modal-body">
                            <dl className="row g-2">
                                <dt className="col-sm-4">Status</dt>
                                <dd className="col-sm-8"><RenderOrderStatus status={order.status} /></dd>

                                <dt className="col-sm-4">Dealer</dt>
                                <dd className="col-sm-8">{dealerName || 'N/A'}</dd>
                                
                                <dt className="col-sm-4">Vehicle Variant</dt>
                                <dd className="col-sm-8">{variantName || 'N/A'}</dd>
                                
                                <dt className="col-sm-4">Quantity</dt>
                                <dd className="col-sm-8">{order.quantity}</dd>
                                
                                <dt className="col-sm-4">Color</dt>
                                <dd className="col-sm-8">{order.color || 'N/A'}</dd>

                                <dt className="col-sm-4">Order Date</dt>
                                <dd className="col-sm-8">{formatDate(order.createdAt)}</dd>

                                <dt className="col-sm-4">Last Updated</dt>
                                <dd className="col-sm-8">{formatDate(order.updatedAt)}</dd>
                                
                                <dt className="col-sm-4">Notes</dt>
                                <dd className="col-sm-8 fst-italic">{order.notes || '—'}</dd>
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