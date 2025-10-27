import React, { useEffect, useState } from 'react'
import { AlertCircle } from 'lucide-react';
import { createPromotion, updatePromotion } from '../../../services/promotionService';

// Helper format ngày giờ
const toDatetimeLocal = (isoDate) => {
    if (!isoDate) return '';
    try {
        const date = new Date(isoDate);
        // Check if date is valid before formatting
        if (isNaN(date.getTime())) return '';
        // Lấy YYYY-MM-DDTHH:mm
        const pad = (num) => num.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    } catch (e) {
        console.error("Error formatting date:", isoDate, e);
        return ''; // Trả về rỗng nếu lỗi
    }
};

export default function PromotionModal({ show, onClose, onSaveSuccess, promotionToEdit }) {
    const isEditMode = Boolean(promotionToEdit);
    const title = isEditMode ? 'Edit Promotion' : 'Add New Promotion';

    const [formData, setFormData] = useState({
        description: '',
        discountPercent: '', // Dùng chuỗi rỗng cho input number
        startDate: toDatetimeLocal(new Date().toISOString()), // Mặc định hiện tại
        endDate: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (show) {
            setError('');
            if (isEditMode && promotionToEdit) {
                setFormData({
                    description: promotionToEdit.description || '',
                    // Hiển thị chuỗi rỗng nếu là null/undefined, ngược lại là số
                    discountPercent: promotionToEdit.discountPercent === null || promotionToEdit.discountPercent === undefined ? '' : String(promotionToEdit.discountPercent),
                    startDate: toDatetimeLocal(promotionToEdit.startDate),
                    endDate: toDatetimeLocal(promotionToEdit.endDate),
                });
            } else {
                setFormData({
                    description: '',
                    discountPercent: '',
                    startDate: toDatetimeLocal(new Date().toISOString()),
                    endDate: '',
                });
            }
        }
    }, [show, promotionToEdit, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation
        if (!formData.description || !formData.startDate || !formData.endDate) {
            setError('Please fill in Description, Start Date, and End Date.');
            setLoading(false);
            return;
        }
        if (formData.discountPercent !== '' && (isNaN(Number(formData.discountPercent)) || Number(formData.discountPercent) < 0 || Number(formData.discountPercent) > 100)) {
            setError('Discount Percent must be a number between 0 and 100, or leave blank.');
            setLoading(false);
            return;
        }
        if (new Date(formData.endDate) <= new Date(formData.startDate)) {
            setError('End Date must be after Start Date.');
            setLoading(false);
            return;
        }

        const dataToSend = {
            description: formData.description,
            // Chuyển đổi thành số hoặc null trước khi gửi
            discountPercent: formData.discountPercent === '' ? null : Number(formData.discountPercent),
            startDate: new Date(formData.startDate).toISOString(),
            endDate: new Date(formData.endDate).toISOString(),
        };

        try {
            let response;
            if (isEditMode) {
                response = await updatePromotion(promotionToEdit.id, dataToSend);
            } else {
                response = await createPromotion(dataToSend);
            }

             if (response.data?.success === true || (response.status >= 200 && response.status < 300) ) {
                onSaveSuccess(isEditMode);
            } else {
                throw new Error(response.data?.message || 'Failed to save promotion');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <>
            <div 
                className={`modal fade ${show ? 'show d-block' : ''}`} 
                tabIndex="-1" 
                style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent' }}
            >
                <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
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
                                {/* Alert messages */}
                                {error && (
                                    <div className="alert alert-danger alert-dismissible d-flex align-items-center" role="alert">
                                    <AlertCircle size={20} className="me-2" />
                                    <div className="flex-grow-1">{error}</div>
                                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                                    </div>
                                )}

                                <div className="row g-3">

                                    {/* Description */}
                                    <div className="col-12">
                                        <label htmlFor="promoDescription" className="form-label">Description *</label>
                                        <input
                                            type="text"
                                            id="promoDescription"
                                            name="description"
                                            className={`form-control ${!formData.description && error ? 'is-invalid' : ''}`}
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="e.g., Year End Sale"
                                            disabled={loading}
                                            required
                                        />
                                    </div>

                                    {/* Discount Percent */}
                                    <div className="col-md-4">
                                        <label htmlFor="promoDiscount" className="form-label">Discount (%)</label>
                                        <input
                                            type="number"
                                            id="promoDiscount"
                                            name="discountPercent"
                                            className={`form-control ${error.includes('Discount') ? 'is-invalid' : ''}`}
                                            value={formData.discountPercent}
                                            onChange={handleChange}
                                            placeholder="e.g., 10 (leave blank if none)"
                                            min="0"
                                            max="100"
                                            step="0.1"
                                            disabled={loading}
                                        />
                                         <div className="form-text">Enter value between 0-100 or leave empty.</div>
                                    </div>

                                    {/* Start Date */}
                                    <div className="col-md-4">
                                        <label htmlFor="promoStartDate" className="form-label">Start Date *</label>
                                        <input
                                            type="datetime-local"
                                            id="promoStartDate"
                                            name="startDate"
                                            className={`form-control ${(!formData.startDate || error.includes('Start Date')) ? 'is-invalid' : ''}`}
                                            value={formData.startDate}
                                            onChange={handleChange}
                                            disabled={loading}
                                            required
                                        />
                                    </div>

                                    {/* End Date */}
                                    <div className="col-md-4">
                                        <label htmlFor="promoEndDate" className="form-label">End Date *</label>
                                        <input
                                            type="datetime-local"
                                            id="promoEndDate"
                                            name="endDate"
                                            className={`form-control ${(!formData.endDate || error.includes('End Date')) ? 'is-invalid' : ''}`}
                                            value={formData.endDate}
                                            onChange={handleChange}
                                            disabled={loading}
                                            required
                                        />
                                    </div>
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
                                    {loading ? 'Saving...' : (isEditMode ? 'Update Promotion' : 'Create Promotion')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
        </>
    )
}
