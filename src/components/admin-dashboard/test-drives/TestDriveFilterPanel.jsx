import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TestDriveFilterPanel = ({ 
    show, 
    onClose, 
    onApplyFilters, 
    currentFilters, 
    dealerMap, 
    customerMap, // [MỚI]
    variantMap  // [MỚI]
}) => {
    
    // [CẬP NHẬT] Thêm state cho các filter mới
    const [localFilters, setLocalFilters] = useState(currentFilters);

    useEffect(() => {
        setLocalFilters(currentFilters);
    }, [currentFilters, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleApply = () => {
        onApplyFilters(localFilters);
    };

    const handleClear = () => {
        // [CẬP NHẬT] Xóa tất cả filter
        const clearedFilters = { 
            dealerId: '', 
            status: '', 
            customerId: '', 
            variantId: '',
            startDate: '',
            endDate: ''
        };
        setLocalFilters(clearedFilters);
        onApplyFilters(clearedFilters);
    };

    return (
        <>
            <div 
                className={`offcanvas offcanvas-end ${show ? 'show' : ''}`} 
                tabIndex="-1" 
                style={{ visibility: show ? 'visible' : 'hidden' }}
            >
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title">Filters</h5>
                    <button
                        type="button"
                        className="btn-close text-reset"
                        onClick={onClose}
                    ></button>
                </div>
                <div className="offcanvas-body">
                    <div className="row">
                        <div className="col-6 mb-3">
                            <label htmlFor="filterStartDate" className="form-label">From Date</label>
                            <input
                                type="date"
                                id="filterStartDate"
                                name="startDate"
                                className="form-control"
                                value={localFilters.startDate || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-6 mb-3">
                            <label htmlFor="filterEndDate" className="form-label">To Date</label>
                            <input
                                type="date"
                                id="filterEndDate"
                                name="endDate"
                                className="form-control"
                                value={localFilters.endDate || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Lọc theo Status */}
                    <div className="mb-3">
                        <label htmlFor="filterStatus" className="form-label">Status</label>
                        <select
                            id="filterStatus"
                            name="status"
                            className="form-select"
                            value={localFilters.status}
                            onChange={handleChange}
                        >
                            <option value="">All Status</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    {/* Lọc theo Dealer */}
                    <div className="mb-3">
                        <label htmlFor="filterDealerId" className="form-label">Dealer</label>
                        <select
                            id="filterDealerId"
                            name="dealerId"
                            className="form-select"
                            value={localFilters.dealerId}
                            onChange={handleChange}
                        >
                            <option value="">All Dealers</option>
                            {Object.entries(dealerMap).map(([id, name]) => (
                                <option key={id} value={id}>{name}</option>
                            ))}
                        </select>
                    </div>

                    {/* [MỚI] Lọc theo Customer */}
                    <div className="mb-3">
                        <label htmlFor="filterCustomerId" className="form-label">Customer</label>
                        <select
                            id="filterCustomerId"
                            name="customerId"
                            className="form-select"
                            value={localFilters.customerId}
                            onChange={handleChange}
                        >
                            <option value="">All Customers</option>
                            {Object.entries(customerMap).map(([id, name]) => (
                                <option key={id} value={id}>{name}</option>
                            ))}
                        </select>
                    </div>

                    {/* [MỚI] Lọc theo Vehicle */}
                    <div className="mb-3">
                        <label htmlFor="filterVariantId" className="form-label">Vehicle</label>
                        <select
                            id="filterVariantId"
                            name="variantId"
                            className="form-select"
                            value={localFilters.variantId}
                            onChange={handleChange}
                        >
                            <option value="">All Vehicles</option>
                            {Object.entries(variantMap).map(([id, name]) => (
                                <option key={id} value={id}>{name}</option>
                            ))}
                        </select>
                    </div>


                    <div className="d-flex justify-content-between mt-4">
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={onClose}
                        >
                            Clear all
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-primary" 
                            onClick={handleApply}
                        >
                            Apply
                        </button>
                    </div>

                </div>
            </div>
            {/* Overlay */}
            {show && <div className="offcanvas-backdrop fade show" onClick={onClose}></div>}
        </>
    );
};

export default TestDriveFilterPanel;