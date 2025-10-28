import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const PaymentFilterPanel = ({ 
    show, 
    onClose, 
    onApplyFilters, 
    currentFilters, 
    dealerMap, 
    customerMap, 
    salesOrderMap // Chỉ cần ID và mã Order
}) => {
    
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
        const clearedFilters = { 
            dealerId: '', 
            status: '', 
            customerId: '', 
            salesOrderId: '',
            startDate: '',
            endDate: '',
            method: ''
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
                    <button type="button" className="btn-close text-reset" onClick={onClose}></button>
                </div>
                <div className="offcanvas-body">
                    
                    {/* Date Range */}
                    <div className="row">
                        <div className="col-6 mb-3">
                            <label htmlFor="filterStartDate" className="form-label">From Date</label>
                            <input type="date" id="filterStartDate" name="startDate" className="form-control" value={localFilters.startDate || ''} onChange={handleChange} />
                        </div>
                        <div className="col-6 mb-3">
                            <label htmlFor="filterEndDate" className="form-label">To Date</label>
                            <input type="date" id="filterEndDate" name="endDate" className="form-control" value={localFilters.endDate || ''} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="mb-3">
                        <label htmlFor="filterStatus" className="form-label">Status</label>
                        <select id="filterStatus" name="status" className="form-select" value={localFilters.status} onChange={handleChange}>
                            <option value="">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="Failed">Failed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    {/* Method */}
                    <div className="mb-3">
                        <label htmlFor="filterMethod" className="form-label">Method</label>
                        <select id="filterMethod" name="method" className="form-select" value={localFilters.method} onChange={handleChange}>
                             <option value="">All Methods</option>
                             <option value="Cash">Cash</option>
                             <option value="Bank Transfer">Bank Transfer</option>
                             <option value="Credit Card">Credit Card</option>
                             <option value="Installment">Installment</option>
                             <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Dealer */}
                    <div className="mb-3">
                        <label htmlFor="filterDealerId" className="form-label">Dealer</label>
                        <select id="filterDealerId" name="dealerId" className="form-select" value={localFilters.dealerId} onChange={handleChange}>
                            <option value="">All Dealers</option>
                            {Object.entries(dealerMap).map(([id, name]) => (<option key={id} value={id}>{name}</option>))}
                        </select>
                    </div>

                    {/* Customer */}
                    <div className="mb-3">
                        <label htmlFor="filterCustomerId" className="form-label">Customer</label>
                        <select id="filterCustomerId" name="customerId" className="form-select" value={localFilters.customerId} onChange={handleChange}>
                            <option value="">All Customers</option>
                            {Object.entries(customerMap).map(([id, name]) => (<option key={id} value={id}>{name}</option>))}
                        </select>
                    </div>

                    {/* Sales Order */}
                    <div className="mb-3">
                        <label htmlFor="filterSalesOrderId" className="form-label">Sales Order</label>
                        <select id="filterSalesOrderId" name="salesOrderId" className="form-select" value={localFilters.salesOrderId} onChange={handleChange}>
                            <option value="">All Orders</option>
                            {/* salesOrderMap: { id: '#ORDER123 - Customer Name' } */}
                             {Object.entries(salesOrderMap).map(([id, display]) => (<option key={id} value={id}>{display}</option>))}
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="d-flex justify-content-between mt-4">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Clear All
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleApply}>Apply</button>
                    </div>

                </div>
            </div>
            {show && <div className="offcanvas-backdrop fade show" onClick={onClose}></div>}
        </>
    );
};

export default PaymentFilterPanel;