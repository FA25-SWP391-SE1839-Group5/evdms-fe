import React from 'react';
import { AlertCircle } from 'lucide-react';
import { createDealerPayment, updateDealerPayment } from '../../../../services/dealerService';

export default function DealerPaymentModal({ show, onClose, onSaveSuccess, dealers, paymentToEdit }) {
    const isEditMode = Boolean(paymentToEdit);
    const title = isEditMode ? 'Edit Dealer Payment' : 'Add New Payment';


    const [formData, setFormData] = useState({
        dealerId: '',
        amount: '',
        paymentMethod: '',
        // Status is usually handled by separate API calls (mark-paid/failed)
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fill form on edit or reset on add
    useEffect(() => {
        if (show) {
        setError('');
        if (isEditMode && paymentToEdit) {
            setFormData({
            dealerId: paymentToEdit.dealerId || '',
            amount: paymentToEdit.amount || '',
            paymentMethod: paymentToEdit.paymentMethod || '',
            });
        } else {
            setFormData({
            dealerId: '',
            amount: '',
            paymentMethod: '',
            });
        }
        }
    }, [show, paymentToEdit, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate
        if (!formData.dealerId || !formData.amount || !formData.paymentMethod) {
            setError('Please fill in all required fields.');
            setLoading(false);
        return;
        }
        if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
            setError('Amount must be a positive number.');
            setLoading(false);
            return;
        }

        const dataToSend = {
            ...formData,
            amount: Number(formData.amount),
        };

        try {
            let response;
            if (isEditMode) {
                // Only send fields that can be updated (e.g., amount, method)
                // API might not allow changing dealerId
                const { dealerId, ...updateData } = dataToSend;
                response = await updateDealerPayment(paymentToEdit.id, updateData);
            } else {
                response = await createDealerPayment(dataToSend);
            }

            if (response.data?.success) {
                onSaveSuccess(isEditMode); 
            } else {
                throw new Error(response.data?.message || 'Failed to save payment');
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Operation failed';
            setError(`Database operation failed: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <>
            <div 
                className={`modal fade ${show ? 'show' : ''}`} 
                style={{ display: show ? 'block' : 'none' }} 
                tabIndex="-1" 
                role="dialog"
            >   
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit}>
                            <div className="modal-header">
                                <h5 className="modal-title">{title}</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={onClose} 
                                    aria-label="Close" 
                                    disabled={loading}
                                ></button>
                            </div>

                            <div className="modal-body">

                                {/* Alert Message */}
                                {error && (
                                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                                        <AlertCircle size={20} className="me-2" />
                                        <div>{error}</div>
                                    </div>
                                )}

                                {/* Dealer Select */}
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="modal-pay-dealerId">Dealer *</label>
                                    <select
                                        id="modal-pay-dealerId"
                                        name="dealerId"
                                        className="form-select"
                                        value={formData.dealerId}
                                        onChange={handleChange}
                                        disabled={isEditMode || loading} // Don't change dealer on edit
                                    >
                                        <option value="">-- Select Dealer --</option>
                                        {dealers && dealers.map(dealer => (
                                            <option key={dealer.id} value={dealer.id}>{dealer.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Amount */}
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="modal-pay-amount">Amount (VND) *</label>
                                    <input
                                        type="number"
                                        id="modal-pay-amount"
                                        name="amount"
                                        className="form-control"
                                        placeholder="e.g., 5000000"
                                        min="0"
                                        step="1000"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                </div>

                                {/* Payment Method */}
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="modal-pay-paymentMethod">Payment Method *</label>
                                    <input
                                        type="text"
                                        id="modal-pay-paymentMethod"
                                        name="paymentMethod"
                                        className="form-control"
                                        placeholder="e.g., Bank Transfer, Cash"
                                        value={formData.paymentMethod}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                    {/* You could change this to a Select if methods are fixed */}
                                </div>

                            </div>

                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-outline-secondary" 
                                    onClick={onClose} 
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary" 
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : (isEditMode ? 'Update Payment' : 'Create Payment')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
            {/* MODAL BACKDROP */}
            {show && <div className="modal-backdrop fade show"></div>}
        </>
    )
}
