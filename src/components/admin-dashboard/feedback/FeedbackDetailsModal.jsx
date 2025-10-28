import React from 'react';

// --- Helper Functions ---
const getAvatarInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length === 1) return name.substring(0, 1).toUpperCase();
    return (parts[0].substring(0, 1) + (parts.length > 1 ? parts[parts.length - 1].substring(0, 1) : '')).toUpperCase();
};
const formatDate = (isoString) => isoString ? new Date(isoString).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A';
const RenderFeedbackStatus = ({ status }) => {
    let badgeClass = 'secondary';
    const st = String(status).toLowerCase();
    switch (st) {
        case 'new': badgeClass = 'info'; break;
        case 'in progress': badgeClass = 'warning'; break;
        case 'resolved': badgeClass = 'success'; break;
        case 'closed': badgeClass = 'danger'; break;
    }
    return <span className={`badge bg-label-${badgeClass}`}>{status || 'N/A'}</span>;
};

const FeedbackViewModal = ({ show, onClose, feedback, customerMap, dealerMap }) => {
    if (!show || !feedback) return null;

    const customerName = customerMap[feedback.customerId] || 'N/A';
    const dealerName = dealerMap[feedback.dealerId] || 'N/A';

    return (
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Feedback Details</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {/* Avatar và Tên Customer */}
                        <div className="d-flex align-items-center mb-3">
                            <div className="avatar avatar-lg me-3">
                                <span className="avatar-initial rounded-circle bg-label-secondary" style={{ fontSize: '2rem' }}>
                                    {getAvatarInitials(customerName)}
                                </span>
                            </div>
                            <div>
                                <h5 className="mb-0">{customerName}</h5>
                                <small className="text-muted">Customer</small>
                            </div>
                        </div>

                        <hr />

                        <div className="row mb-3">
                            <div className="col-6">
                                <label className="form-label text-muted">Status</label>
                                <div><RenderFeedbackStatus status={feedback.status} /></div>
                            </div>
                            <div className="col-6">
                                <label className="form-label text-muted">Date</label>
                                <p className="fw-semibold">{formatDate(feedback.createdAt)}</p>
                            </div>
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label text-muted">Dealer</label>
                            <p className="fw-semibold">{dealerName}</p>
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label text-muted">Content</label>
                            <p style={{ whiteSpace: 'pre-wrap' }}>{feedback.content}</p>
                        </div>

                    </div>
                    <div className="modal-footer">
                        <button 
                            type="button" 
                            className="btn btn-label-secondary" 
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackViewModal;