import React, { useState, useEffect } from 'react';

const FeedbackStatusModal = ({ show, onClose, onSave, currentStatus }) => {
    const [newStatus, setNewStatus] = useState(currentStatus);
    const [isSaving, setIsSaving] = useState(false);

    // Cập nhật state nội bộ khi prop `currentStatus` thay đổi (lúc modal mở)
    useEffect(() => {
        if (show) {
            setNewStatus(currentStatus || 'New');
        }
    }, [currentStatus, show]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave(newStatus);
            // onClose() sẽ được gọi từ component cha (FeedbackManagement)
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
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={onClose} 
                                disabled={isSaving}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <label htmlFor="feedbackStatus" className="form-label">New Status</label>
                            <select
                                id="feedbackStatus"
                                className="form-select"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                            >
                                <option value="New">New</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>
                        <div className="modal-footer">
                            <button 
                                type="button" 
                                className="btn btn-label-secondary" 
                                onClick={onClose} 
                                disabled={isSaving}
                            >
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

export default FeedbackStatusModal;