import React, { useState, useEffect, useMemo } from 'react';

// Giả định các status
const ALL_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const SalesOrderFilterPanel = ({ show, onClose, currentFilters, onApplyFilters, dealers = [] }) => {
    // State cục bộ
    const [selectedTimePeriod, setSelectedTimePeriod] = useState(currentFilters.timePeriod || 'all');
    const [selectedStatus, setSelectedStatus] = useState(currentFilters.status || '');
    const [selectedDealerId, setSelectedDealerId] = useState(currentFilters.dealerId || '');
    const [selectedRegion, setSelectedRegion] = useState(currentFilters.region || '');

    // Lấy danh sách khu vực (regions) duy nhất từ danh sách dealers
    const uniqueRegions = useMemo(() => {
        const regions = new Set(dealers.map(d => d.region).filter(Boolean));
        return Array.from(regions);
    }, [dealers]);

    // Cập nhật state khi panel mở
    useEffect(() => {
        if (show) {
            setSelectedTimePeriod(currentFilters.timePeriod || 'all');
            setSelectedStatus(currentFilters.status || '');
            setSelectedDealerId(currentFilters.dealerId || '');
            setSelectedRegion(currentFilters.region || '');
        }
    }, [show, currentFilters]);

    // Xử lý logic cho các hàm apply, reset
    const handleApply = () => {
        onApplyFilters({
            timePeriod: selectedTimePeriod,
            status: selectedStatus,
            dealerId: selectedDealerId,
            region: selectedRegion,
        });
        onClose();
    };

    const handleReset = () => {
        setSelectedTimePeriod('all');
        setSelectedStatus('');
        setSelectedDealerId('');
        setSelectedRegion('');
        onApplyFilters({ timePeriod: 'all', status: '', dealerId: '', region: '' });
        onClose();
    };

    // Thêm useEffect để quản lý class 'offcanvas-open' trên body
    useEffect(() => {
        if (show) {
            document.body.classList.add('offcanvas-open');
        } else {
            document.body.classList.remove('offcanvas-open');
        }
        return () => {
            document.body.classList.remove('offcanvas-open');
        };
    }, [show]);

    return (
        <>
            <div
                className={`offcanvas offcanvas-end ${show ? 'show' : ''}`}
                tabIndex="-1"
                id="salesOrderFilterOffcanvas"
                aria-labelledby="salesOrderFilterOffcanvasLabel"
            >
                <div className="offcanvas-header border-bottom">
                    <h5 id="salesOrderFilterOffcanvasLabel" className="offcanvas-title">Filters</h5>
                    <button type="button" className="btn-close text-reset" onClick={onClose} aria-label="Close"></button>
                </div>
                <div className="offcanvas-body d-flex flex-column">

                    {/* Time Period */}
                    <div className="mb-4">
                        <h6><i className="bx bx-time-five me-2"></i>Time Period</h6>
                        <div className="d-flex flex-wrap gap-2">
                             {['all', 'today', 'last7days', 'last30days'].map(period => (
                                <button
                                    key={period} type="button"
                                    className={`btn btn-sm ${selectedTimePeriod === period ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    onClick={() => setSelectedTimePeriod(period)}
                                >
                                    {period === 'all' ? 'All Time' : period === 'today' ? 'Today' : period === 'last7days' ? 'Last 7 Days' : 'Last 30 Days'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="mb-3">
                        <label htmlFor="filterStatus" className="form-label">Status</label>
                        <select
                            id="filterStatus"
                            className="form-select"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    {/* Dealer Filter */}
                    <div className="mb-3">
                        <label htmlFor="filterDealer" className="form-label">Dealer</label>
                        <select
                            id="filterDealer"
                            className="form-select"
                            value={selectedDealerId}
                            onChange={(e) => setSelectedDealerId(e.target.value)}
                        >
                            <option value="">All Dealers</option>
                            {dealers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                    </div>

                    {/* Region Filter */}
                    <div className="mb-3">
                        <label htmlFor="filterRegion" className="form-label">Region</label>
                        <select
                            id="filterRegion"
                            className="form-select"
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                        >
                            <option value="">All Regions</option>
                            {uniqueRegions.map(r => <option key={r} value={r}>{r}</option>)}
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

export default SalesOrderFilterPanel;