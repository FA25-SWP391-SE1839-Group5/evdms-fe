import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TestDriveFilterPanel = ({ show, onClose, onApplyFilters, currentFilters, dealerMap }) => {
    
    const [localFilters, setLocalFilters] = useState(currentFilters);

    // Cập nhật state nội bộ khi filter bên ngoài thay đổi
    useEffect(() => {
        setLocalFilters(currentFilters);
    }, [currentFilters, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleApply = () => {
        onApplyFilters(localFilters); // Gửi state nội bộ ra ngoài
    };

    const handleClear = () => {
        const clearedFilters = { dealerId: '', status: '' };
        setLocalFilters(clearedFilters);
        onApplyFilters(clearedFilters); // Gửi state đã clear ra ngoài
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

                    <div className="d-flex justify-content-between mt-4">
                        <button 
                            type="button" 
                            className="btn btn-label-secondary" 
                            onClick={handleClear}
                        >
                            Clear All
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