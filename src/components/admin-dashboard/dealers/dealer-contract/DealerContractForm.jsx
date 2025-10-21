import React, { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle } from 'lucide-react';
import { createDealerContract } from '../../../../services/dealerService';

// Hàm helper để format ngày cho input datetime-local
    const toDatetimeLocal = (isoDate) => {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        // Cắt bỏ phần milliseconds và 'Z'
        return date.toISOString().slice(0, 16);
    };

export default function DealerContractForm({ show, onClose, onContractAdded, dealers }) {
    const [formData, setFormData] = useState({
        dealerId: '',
        startDate: toDatetimeLocal(new Date().toISOString()), // Mặc định ngày giờ hiện tại
        endDate: '',
        salesTarget: 0,
        // outstandingDebt không cần khi tạo, backend sẽ tự gán
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // 1. Thêm useEffect để reset form khi modal được mở
    useEffect(() => {
        if (show) {
        setError('');
        setFormData({
            dealerId: '',
            startDate: toDatetimeLocal(new Date().toISOString()),
            endDate: '',
            salesTarget: 0,
        });
        }
    }, [show]);

    // 2. Tự động ẩn thông báo
    useEffect(() => {
        if (error || success) {
        const timer = setTimeout(() => {
            setError('');
            setSuccess('');
        }, 5000);
        return () => clearTimeout(timer);
        }
    }, [error, success]);

    // 3. Handler cho form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: value
        }));
    };

    // 4. Handler submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Validate
        if (!formData.dealerId || !formData.startDate || !formData.endDate) {
            setError('Please select a dealer and set start/end dates.');
            setLoading(false);
            return;
        }

        // Chuyển đổi dữ liệu trước khi gửi
        const dataToSend = {
            ...formData,
            salesTarget: Number(formData.salesTarget) || 0,
            // Đảm bảo ngày gửi đi là định dạng ISO
            startDate: new Date(formData.startDate).toISOString(),
            endDate: new Date(formData.endDate).toISOString(),
        };

        try {
            const response = await createDealerContract(dataToSend);
            if (response.data?.success) {
                onContractAdded();
            } else {
                throw new Error(response.data?.message || 'Failed to create contract');
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Operation failed';
            setError(`Database operation failed: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    // 5. Thêm check 'show'
    if (!show) {
        return null;
    }

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
                            <h5 className="modal-title">Add New Contract</h5>
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={onClose} 
                                aria-label="Close"
                                disabled={loading}
                            ></button>
                        </div>
                        <div className="modal-body">
                    
                        {/* Thông báo lỗi (nếu có) */}
                        {error && (
                        <div className="alert alert-danger d-flex align-items-center" role="alert">
                            <AlertCircle size={20} className="me-2" />
                            <div>{error}</div>
                        </div>
                        )}

                        {/* Field 1: Dealer (Select) */}
                        <div className="mb-3">
                            <label className="form-label" htmlFor="modal-dealerId">Dealer *</label>
                            <div className="input-group input-group-merge">
                                <span className="input-group-text"><i className="bx bx-store" /></span>
                                <select
                                    id="modal-dealerId"
                                    name="dealerId"
                                    className="form-select"
                                    value={formData.dealerId}
                                    onChange={handleChange}
                                >
                                    <option value="">-- Select a Dealer --</option>

                                    {/* 9. Dùng 'dealers' từ props */}
                                    {dealers && dealers.map(dealer => (
                                        <option key={dealer.id} value={dealer.id}>
                                            {dealer.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Field 2: Start Date */}
                        <div className="mb-3">
                            <label className="form-label" htmlFor="modal-startDate">Start Date *</label>
                            <div className="input-group input-group-merge">
                                <span className="input-group-text"><i className="bx bx-calendar" /></span>
                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    id="modal-startDate"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Field 3: End Date */}
                        <div className="mb-3">
                            <label className="form-label" htmlFor="modal-endDate">End Date *</label>
                            <div className="input-group input-group-merge">
                                <span className="input-group-text"><i className="bx bx-calendar-check" /></span>
                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    id="modal-endDate"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Field 4: Sales Target */}
                        <div className="mb-3">
                            <label className="form-label" htmlFor="modal-salesTarget">Sales Target (VND)</label>
                            <div className="input-group input-group-merge">
                                <span className="input-group-text"><i className="bx bx-dollar" /></span>
                                <input
                                    type="number"
                                    id="modal-salesTarget"
                                    name="salesTarget"
                                    className="form-control"
                                    placeholder="0"
                                    value={formData.salesTarget}
                                    onChange={handleChange}
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
                            {loading ? 'Saving...' : 'Create Contract'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        
            {/* Modal Backdrop */}
            {show && <div className="modal-backdrop fade show"></div>}
        </>
    )
}
