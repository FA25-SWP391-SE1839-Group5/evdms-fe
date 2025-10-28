import React, { useState, useEffect, useMemo } from 'react';

const TestDriveFormModal = ({ show, onClose, onSave, testDrive, customerMap, variantMap, dealerMap }) => {
    const [formData, setFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    const isEditMode = useMemo(() => testDrive && testDrive.id, [testDrive]);

    useEffect(() => {
        if (show) {
            setFormData(isEditMode ? { ...testDrive } : {
                customerId: '',
                variantId: '',
                dealerId: '', // Thêm dealerId
                scheduledAt: '',
                status: 'Scheduled'
            });
        }
    }, [testDrive, isEditMode, show]);
    
    // Xử lý khi scheduledAt từ API (ISO string)
    const formattedScheduledAt = useMemo(() => {
        if (!formData.scheduledAt) return '';
        try {
            const date = new Date(formData.scheduledAt);
            // Convert to YYYY-MM-DDTHH:mm
            return date.toISOString().slice(0, 16);
        } catch (e) {
            return '';
        }
    }, [formData.scheduledAt]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave(formData);
        } catch (error) {
            // Lỗi đã được xử lý ở component cha
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
                                {isEditMode ? 'Edit Test Drive' : 'Schedule New Test Drive'}
                            </h5>
                            <button type="button" className="btn-close" onClick={onClose} disabled={isSaving}></button>
                        </div>
                        <div className="modal-body">
                            
                            <div className="mb-3">
                                <label htmlFor="customerId" className="form-label">Customer</label>
                                <select
                                    className="form-select"
                                    id="customerId"
                                    name="customerId"
                                    value={formData.customerId || ''}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Select a customer</option>
                                    {Object.entries(customerMap).map(([id, name]) => (
                                        <option key={id} value={id}>{name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* Tui thêm Dealer, vì trang quản lý thường cần chọn */}
                            <div className="mb-3">
                                <label htmlFor="dealerId" className="form-label">Dealer</label>
                                <select
                                    className="form-select"
                                    id="dealerId"
                                    name="dealerId"
                                    value={formData.dealerId || ''}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Select a dealer</option>
                                    {Object.entries(dealerMap).map(([id, name]) => (
                                        <option key={id} value={id}>{name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="variantId" className="form-label">Vehicle Variant</label>
                                <select
                                    className="form-select"
                                    id="variantId"
                                    name="variantId"
                                    value={formData.variantId || ''}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Select a vehicle</option>
                                    {Object.entries(variantMap).map(([id, name]) => (
                                        <option key={id} value={id}>{name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="mb-3">
                                <label htmlFor="scheduledAt" className="form-label">Scheduled Date & Time</label>
                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    id="scheduledAt"
                                    name="scheduledAt"
                                    value={formattedScheduledAt}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                             <div className="mb-3">
                                <label htmlFor="status" className="form-label">Status</label>
                                <select
                                    className="form-select"
                                    id="status"
                                    name="status"
                                    value={formData.status || 'Scheduled'}
                                    onChange={handleChange}
                                >
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
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

export default TestDriveFormModal;