import React, { useState, useEffect, useMemo } from 'react';

const CustomerModal = ({ show, onClose, onSave, customer }) => {
    const [formData, setFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    const isEditMode = useMemo(() => customer && customer.id, [customer]);

    useEffect(() => {
        // Set form data khi 'customer' prop thay đổi (lúc mở modal)
        if (show) {
            setFormData(isEditMode ? { ...customer } : {
                fullName: '',
                email: '',
                phone: '',
                address: ''
            });
        }
    }, [customer, isEditMode, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // onSave là hàm handleModalSave từ component cha
            await onSave(formData);
        } catch (error) {
            // Lỗi đã được xử lý ở component cha (nơi gọi onSave)
        } finally {
            setIsSaving(false);
        }
    };

    if (!show) return null;

    return (
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {isEditMode ? 'Edit Customer' : 'Add New Customer'}
                            </h5>
                            <button type="button" className="btn-close" onClick={onClose} disabled={isSaving}></button>
                        </div>
                        <div className="modal-body">
                            {/* Dựa trên API: fullName, email, phone, address */}
                            <div className="mb-3">
                                <label htmlFor="fullName" className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    value={formData.email || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="phone" className="form-label">Phone</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone || ''}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="address" className="form-label">Address</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="address"
                                    name="address"
                                    value={formData.address || ''}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-label-secondary" onClick={onClose} disabled={isSaving}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CustomerModal;