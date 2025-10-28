import React from 'react';

// --- Helper Functions ---
const getAvatarInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length === 1) return name.substring(0, 1).toUpperCase();
    return (parts[0].substring(0, 1) + (parts.length > 1 ? parts[parts.length - 1].substring(0, 1) : '')).toUpperCase();
};
const formatFullDateTime = (isoString) => isoString ? new Date(isoString).toLocaleString('vi-VN', { dateStyle: 'long', timeStyle: 'short' }) : 'N/A';
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


const TestDriveDetailsModal = ({ show, onClose, testDrive, customerMap, dealerMap, variantMap }) => {
    if (!show || !testDrive) return null;

    const customerName = customerMap[testDrive.customerId] || 'N/A';
    const dealerName = dealerMap[testDrive.dealerId] || 'N/A';
    const variantName = variantMap[testDrive.variantId] || 'N/A';

    return (
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Test Drive Details</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        
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
                                <div><RenderTestDriveStatus status={testDrive.status} /></div>
                            </div>
                            <div className="col-6">
                                <label className="form-label text-muted">Scheduled For</label>
                                <p className="fw-semibold">{formatFullDateTime(testDrive.scheduledAt)}</p>
                            </div>
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label text-muted">Vehicle</label>
                            <p className="fw-semibold">{variantName}</p>
                        </div>

                        <div className="mb-3">
                            <label className="form-label text-muted">Dealer</label>
                            <p className="fw-semibold">{dealerName}</p>
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label text-muted">Booked On</label>
                            <p className="fw-semibold">{formatFullDateTime(testDrive.createdAt)}</p>
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

export default TestDriveDetailsModal;