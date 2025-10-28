import React from 'react';

// --- Helper Functions ---
const getAvatarInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length === 1) return name.substring(0, 1).toUpperCase();
    return (parts[0].substring(0, 1) + (parts.length > 1 ? parts[parts.length - 1].substring(0, 1) : '')).toUpperCase();
};

const formatCustomerId = (id) => `#${id?.slice(-6).toUpperCase() || 'N/A'}`;

const CustomerDetailsModal = ({ show, onClose, customer }) => {
    if (!show || !customer) return null;

    const DetailItem = ({ label, value }) => (
        <div className="mb-3">
            <label className="form-label text-muted">{label}</label>
            <p className="fw-semibold">{value || 'N/A'}</p>
        </div>
    );

    return (
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Customer Details</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {/* Avatar và Tên */}
                        <div className="d-flex align-items-center mb-3">
                            <div className="avatar avatar-lg me-3">
                                <span className="avatar-initial rounded-circle bg-label-secondary" style={{ fontSize: '2rem' }}>
                                    {getAvatarInitials(customer.fullName)}
                                </span>
                            </div>
                            <div>
                                <h5 className="mb-0">{customer.fullName}</h5>
                                <small className="text-muted">{customer.email}</small>
                            </div>
                        </div>

                        <hr />

                        <div className="row">
                            <div className="col-md-6">
                                <DetailItem label="Customer ID" value={formatCustomerId(customer.id)} />
                            </div>
                            <div className="col-md-6">
                                <DetailItem label="Phone" value={customer.phone} />
                            </div>
                        </div>
                        <DetailItem label="Address" value={customer.address} />
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

export default CustomerDetailsModal;