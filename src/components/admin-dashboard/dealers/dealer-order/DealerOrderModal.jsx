import React { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { createDealerOrder, updateDealerOrder } from '../../../../services/dealerService';
import { getAllVehicleVariants } from '../../../../services/dealerService';
import { useState } from 'react';
import { useEffect } from 'react';

export default function DealerOrderModal({ show, onClose, onSaveSuccess, dealers, orderToEdit }) {
    const isEditMode = Boolean(orderToEdit);
    const title = isEditMode ? 'Edit Dealer Order' : 'Create New Dealer Order';
    const [variants, setVariants] = useState([]); 
    const [loadingVariants, setLoadingVariants] = useState(false);

    const [formData, setFormData] = useState({
        dealerId: '',
        variantId: '',
        quantity: 1,
        color: '',
        status: 'Pending', 
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (show) {
        const fetchVariants = async () => {
            setLoadingVariants(true);
            setError(''); // Xóa lỗi cũ (nếu có)
            try {
                const response = await getAllVehicleVariants();
                // Giả định response có dạng { data: { data: { items: [...] } } }
                // Hoặc chỉ { data: { items: [...] } }
                // Hoặc chỉ { data: [...] }
                // --> Hãy kiểm tra cấu trúc response thực tế và điều chỉnh nếu cần
                const items = response.data?.data?.items || response.data?.items || response.data || [];
                setVariants(items);
            } catch (err) {
                console.error("Failed to load vehicle variants:", err);
                setError(`Failed to load vehicle variants: ${err.response?.data?.message || err.message}`);
            } finally {
            setLoadingVariants(false);
            }
        };
        fetchVariants();
        }
    }, [show]);
    
    useEffect(() => {
        if (show) {
        // setError(''); // Đã chuyển lên useEffect trên
        if (isEditMode && orderToEdit) {
            setFormData({
            dealerId: orderToEdit.dealerId || '',
            variantId: orderToEdit.variantId || '',
            quantity: orderToEdit.quantity || 1,
            color: orderToEdit.color || '',
            status: orderToEdit.status || 'Pending',
            });
        } else {
            setFormData({
            dealerId: '',
            variantId: '',
            quantity: 1,
            color: '',
            status: 'Pending',
            });
        }
        }
    }, [show, orderToEdit, isEditMode]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate
        if (!formData.dealerId || !formData.variantId || !formData.quantity || !formData.color || !formData.status) {
            setError('Please fill in all required fields.');
            setLoading(false);
            return;
        }
        if (Number(formData.quantity) < 1) {
            setError('Quantity must be at least 1.');
            setLoading(false);
            return;
        }

        const dataToSend = {
            ...formData,
            quantity: Number(formData.quantity),
        };

        try {
            let response;
            if (isEditMode) {
                response = await updateDealerOrder(orderToEdit.id, dataToSend);
            } else {
                response = await createDealerOrder(dataToSend);
            }

            if (response.data?.success) {
                onSaveSuccess(isEditMode); 
            } else {
                throw new Error(response.data?.message || 'Failed to save order');
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

                                {error && ( /* ... code hiển thị lỗi ... */ 
                                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                                        <AlertCircle size={20} className="me-2" />
                                        <div>{error}</div>
                                    </div>
                                )}

                                {/* Dealer Select */}
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="modal-order-dealerId">Dealer *</label>
                                    <select
                                        id="modal-order-dealerId"
                                        name="dealerId"
                                        className="form-select"
                                        value={formData.dealerId}
                                        onChange={handleChange}
                                        disabled={isEditMode || loading} // Không cho đổi dealer khi edit
                                    >
                                        <option value="">-- Select Dealer --</option>
                                        {dealers && dealers.map(dealer => (
                                            <option key={dealer.id} value={dealer.id}>
                                                {dealer.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Variant Select */}
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="modal-order-variantId">Vehicle Variant *</label>
                                    <select
                                        id="modal-order-variantId"
                                        name="variantId"
                                        className="form-select"
                                        value={formData.variantId}
                                        onChange={handleChange}
                                        disabled={loading || loadingVariants} 
                                    >
                                        <option value="">-- Select Variant --</option>
                                        {variants.map(variant => (
                                            <option key={variant.id} value={variant.id}>
                                                {variant.name} 
                                            </option>
                                        ))}
                                    </select>
                                    {loadingVariants && <div className="form-text text-muted">Loading variants...</div>}
                                </div>

                                {/* Quantity */}
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="modal-order-quantity">Quantity *</label>
                                    <input
                                        type="number"
                                        id="modal-order-quantity"
                                        name="quantity"
                                        className="form-control"
                                        min="1"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                </div>

                                {/* Color */}
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="modal-order-color">Color *</label>
                                    <input
                                        type="text"
                                        id="modal-order-color"
                                        name="color"
                                        className="form-control"
                                        placeholder="E.g., Red, Blue"
                                        value={formData.color}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
