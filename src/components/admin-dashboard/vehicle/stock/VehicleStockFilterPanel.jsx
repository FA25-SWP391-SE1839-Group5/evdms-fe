// File: components/admin-dashboard/vehicle-inventory/stock/VehicleStockFilterPanel.jsx
import React, { useState, useEffect } from 'react';

// Định nghĩa các loại và trạng thái xe có thể có
const VEHICLE_TYPES = ['New', 'Used', 'Demo'];
const VEHICLE_STATUSES = ['Available', 'Reserved', 'Sold', 'InTransit'];

const VehicleStockFilterPanel = ({ show, onClose, currentFilters, onApplyFilters, variants = [], dealers = [] }) => {
    // State cục bộ cho panel
    const [selectedVariantId, setSelectedVariantId] = useState(currentFilters.variantId || '');
    const [selectedDealerId, setSelectedDealerId] = useState(currentFilters.dealerId || '');
    const [selectedColor, setSelectedColor] = useState(currentFilters.color || '');
    const [selectedType, setSelectedType] = useState(currentFilters.type || '');
    const [selectedStatus, setSelectedStatus] = useState(currentFilters.status || '');

    // Cập nhật state khi panel mở
    useEffect(() => {
        if (show) {
            setSelectedVariantId(currentFilters.variantId || '');
            setSelectedDealerId(currentFilters.dealerId || '');
            setSelectedColor(currentFilters.color || '');
            setSelectedType(currentFilters.type || '');
            setSelectedStatus(currentFilters.status || '');
        }
    }, [show, currentFilters]);

    const handleApply = () => {
        onApplyFilters({
            variantId: selectedVariantId,
            dealerId: selectedDealerId,
            color: selectedColor.trim(), // Bỏ khoảng trắng thừa
            type: selectedType,
            status: selectedStatus,
        });
        onClose();
    };

    const handleReset = () => {
        setSelectedVariantId('');
        setSelectedDealerId('');
        setSelectedColor('');
        setSelectedType('');
        setSelectedStatus('');
        onApplyFilters({ variantId: '', dealerId: '', color: '', type: '', status: '' });
        onClose();
    };

    return (
        <>
            <div
                className={`offcanvas offcanvas-end ${show ? 'show' : ''}`}
                tabIndex="-1"
                id="vehicleStockFilterOffcanvas"
                aria-labelledby="vehicleStockFilterOffcanvasLabel"
            >
                <div className="offcanvas-header border-bottom">
                    <h5 id="vehicleStockFilterOffcanvasLabel" className="offcanvas-title">Filters</h5>
                    <button type="button" className="btn-close text-reset" onClick={onClose} aria-label="Close"></button>
                </div>
                <div className="offcanvas-body d-flex flex-column">

                    {/* Filter Variant */}
                    <div className="mb-3">
                        <label htmlFor="filterVariantId" className="form-label">Variant</label>
                        <select
                            id="filterVariantId"
                            className="form-select"
                            value={selectedVariantId}
                            onChange={(e) => setSelectedVariantId(e.target.value)}
                        >
                            <option value="">All Variants</option>
                            {variants.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                        </select>
                    </div>

                    {/* Filter Dealer */}
                    <div className="mb-3">
                        <label htmlFor="filterDealerId" className="form-label">Assigned Dealer</label>
                        <select
                            id="filterDealerId"
                            className="form-select"
                            value={selectedDealerId}
                            onChange={(e) => setSelectedDealerId(e.target.value)}
                        >
                            <option value="">Any / Unassigned</option>
                            {dealers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                    </div>

                    {/* Filter Color */}
                    <div className="mb-3">
                        <label htmlFor="filterColor" className="form-label">Color</label>
                        <input
                            type="text"
                            id="filterColor"
                            className="form-control"
                            placeholder="Enter color..."
                            value={selectedColor}
                            onChange={(e) => setSelectedColor(e.target.value)}
                        />
                    </div>

                    {/* Filter Type */}
                    <div className="mb-3">
                        <label htmlFor="filterType" className="form-label">Type</label>
                        <select
                            id="filterType"
                            className="form-select"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                        >
                            <option value="">All Types</option>
                            {VEHICLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    {/* Filter Status */}
                    <div className="mb-3">
                        <label htmlFor="filterStatus" className="form-label">Status</label>
                        <select
                            id="filterStatus"
                            className="form-select"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            {VEHICLE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>


                    {/* Buttons */}
                    <div className="mt-auto d-flex justify-content-between">
                        <button type="button" className="btn btn-outline-secondary" onClick={handleReset}>Reset</button>
                        <button type="button" className="btn btn-primary" onClick={handleApply}>Apply Filters</button>
                    </div>

                </div>
            </div>
            {/* Backdrop */}
            {show && <div className="offcanvas-backdrop fade show" onClick={onClose}></div>}
        </>
    );
};

export default VehicleStockFilterPanel;