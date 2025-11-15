import React, { useState, useEffect } from 'react';

const TestDriveStatusModal = ({ show, onClose, onSave, currentStatus }) => {
    const [newStatus, setNewStatus] = useState(currentStatus);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (show) {
            setNewStatus(currentStatus || 'Scheduled');
        }
    }, [currentStatus, show]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave(newStatus);
        } catch (error) {
            // Lỗi đã được xử lý ở component cha
        } finally {
            setIsSaving(false);
        }
    };

    if (!show) return null;

    return (
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} >
            <div className="modal-dialog modal-dialog-centered modal-sm">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">Update Status</h5>
                            <button type="button" className="btn-close" onClick={onClose} disabled={isSaving}></button>
                        </div>
                        <div className="modal-body">
                            <label htmlFor="testDriveStatus" className="form-label">New Status</label>
                            <select
                                id="testDriveStatus"
                                className="form-select"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                            >
                                <option value="Scheduled">Scheduled</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
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

export default TestDriveStatusModal;