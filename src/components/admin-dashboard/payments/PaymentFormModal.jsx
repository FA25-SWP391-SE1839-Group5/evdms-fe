import React, { useState, useEffect, useMemo } from 'react';

const PaymentFormModal = ({ show, onClose, onSave, payment, salesOrderMap }) => { 
    const [formData, setFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    const isEditMode = useMemo(() => payment && payment.id, [payment]);

    useEffect(() => {
        if (show) {
            setFormData(isEditMode ? { ...payment } : {
                salesOrderId: '',
                amount: '',
                method: 'Cash',
                status: 'Pending'
            });
        }
    }, [payment, isEditMode, show]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'number' ? parseFloat(value) || '' : value 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave(formData);
        } catch (error) {
           // Lỗi đã xử lý ở cha
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
                                {isEditMode ? 'Edit Payment' : 'Create New Payment'}
                            </h5>
                            <button type="button" className="btn-close" onClick={onClose} disabled={isSaving}></button>
                        </div>
                        <div className="modal-body">
                            
                            <div className="mb-3">
                                <label htmlFor="salesOrderId" className="form-label">Sales Order</label>
                                <select
                                    className="form-select"
                                    id="salesOrderId"
                                    name="salesOrderId"
                                    value={formData.salesOrderId || ''}
                                    onChange={handleChange}
                                    required
                                    disabled={isEditMode} // Không cho sửa Order khi Edit
                                >
                                    <option value="" disabled>Select an order</option>
                                    {/* salesOrderMap: { id: '#ORDER123 - Customer Name' } */}
                                    {Object.entries(salesOrderMap).map(([id, display]) => (
                                        <option key={id} value={id}>{display}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="amount" className="form-label">Amount (VND)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="amount"
                                    name="amount"
                                    value={formData.amount || ''}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                />
                            </div>

                             <div className="mb-3">
                                <label htmlFor="method" className="form-label">Payment Method</label>
                                <select
                                    className="form-select"
                                    id="method"
                                    name="method"
                                    value={formData.method || 'Cash'}
                                    onChange={handleChange}
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Credit Card">Credit Card</option>
                                    <option value="Installment">Installment</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            
                            {/* Chỉ hiển thị Status khi Edit */}
                            {isEditMode && (
                                <div className="mb-3">
                                    <label htmlFor="status" className="form-label">Status</label>
                                    <select
                                        className="form-select"
                                        id="status"
                                        name="status"
                                        value={formData.status || 'Pending'}
                                        onChange={handleChange}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Failed">Failed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                            )}

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

export default PaymentFormModal;