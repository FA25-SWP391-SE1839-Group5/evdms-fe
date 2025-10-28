import React, { useState, useEffect } from 'react';

// Giả định danh sách các role và action type có thể có
const ALL_ROLES = ['Admin', 'DealerManager', 'DealerStaff', 'EVMStaff', 'Unknown'];
const ALL_ACTIONS = ['Login', 'Create', 'Update', 'Delete', 'Upload', 'Export']; // Thêm các action khác nếu cần

const AuditLogFilterPanel = ({ show, onClose, currentFilters, onApplyFilters }) => {
    // State cục bộ để quản lý lựa chọn trong panel
    const [selectedTimePeriod, setSelectedTimePeriod] = useState(currentFilters.timePeriod || 'all');
    const [selectedRoles, setSelectedRoles] = useState(currentFilters.roles || []);
    const [selectedActions, setSelectedActions] = useState(currentFilters.actions || []);

    // Cập nhật state cục bộ khi currentFilters từ cha thay đổi (khi mở panel)
    useEffect(() => {
        if (show) {
            setSelectedTimePeriod(currentFilters.timePeriod || 'all');
            setSelectedRoles(currentFilters.roles || []);
            setSelectedActions(currentFilters.actions || []);
        }
    }, [show, currentFilters]);
    
    useEffect(() => {
        if (show) {
            document.body.classList.add('offcanvas-open');
        } else {
            document.body.classList.remove('offcanvas-open');
        }
        // Cleanup function khi component unmount
        return () => {
            document.body.classList.remove('offcanvas-open');
        };
    }, [show]); // Chạy khi state 'show' thay đổi

    const handleRoleChange = (role) => {
        setSelectedRoles(prev =>
            prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
        );
    };

    const handleActionChange = (action) => {
         setSelectedActions(prev =>
            prev.includes(action) ? prev.filter(a => a !== action) : [...prev, action]
        );
    };

    const handleApply = () => {
        onApplyFilters({
            timePeriod: selectedTimePeriod,
            roles: selectedRoles,
            actions: selectedActions,
        });
        onClose(); // Đóng panel sau khi áp dụng
    };

    const handleReset = () => {
        setSelectedTimePeriod('all');
        setSelectedRoles([]);
        setSelectedActions([]);
        // Có thể gọi apply ngay hoặc đợi người dùng nhấn Apply
        onApplyFilters({ timePeriod: 'all', roles: [], actions: [] });
        onClose();
    };


    // Dùng Bootstrap Offcanvas
    return (
        <>
            <div
                className={`offcanvas offcanvas-end ${show ? 'show' : ''}`}
                tabIndex="-1"
                id="auditLogFilterOffcanvas"
                aria-labelledby="auditLogFilterOffcanvasLabel"
                style={{ visibility: show ? 'visible' : 'hidden' }} // Điều khiển hiển thị
            >
                <div className="offcanvas-header border-bottom">
                    <h5 id="auditLogFilterOffcanvasLabel" className="offcanvas-title">Filters</h5>
                    <button type="button" className="btn-close text-reset" onClick={onClose} aria-label="Close"></button>
                </div>
                <div className="offcanvas-body d-flex flex-column">

                    {/* Time Period */}
                    <div className="mb-4">
                        <h6><i className="bx bx-time-five me-2"></i>Time Period</h6>
                        <div className="d-flex flex-wrap gap-2">
                            {['all', 'today', 'last7days', 'last30days'].map(period => (
                                <button
                                    key={period}
                                    type="button"
                                    className={`btn btn-sm ${selectedTimePeriod === period ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    onClick={() => setSelectedTimePeriod(period)}
                                >
                                    {period === 'all' ? 'All Time' :
                                    period === 'today' ? 'Today' :
                                    period === 'last7days' ? 'Last 7 Days' : 'Last 30 Days'}
                                </button>
                            ))}
                            {/* Thêm Custom Range nếu cần */}
                        </div>
                    </div>

                    {/* User Roles (Thay cho Regions) */}
                    <div className="mb-4">
                        <h6><i className="bx bx-user-circle me-2"></i>User Roles</h6>
                        <div className="d-flex flex-wrap gap-2">
                            {ALL_ROLES.map(role => (
                                <div key={role} className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`role-${role}`}
                                        value={role}
                                        checked={selectedRoles.includes(role)}
                                        onChange={() => handleRoleChange(role)}
                                    />
                                    <label className="form-check-label" htmlFor={`role-${role}`}>
                                        {role}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Types (Thay cho Key Metrics) */}
                    <div className="mb-4">
                        <h6><i className="bx bx-list-check me-2"></i>Action Types</h6>
                        <div className="d-flex flex-wrap gap-2">
                            {ALL_ACTIONS.map(action => (
                                <div key={action} className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`action-${action}`}
                                        value={action}
                                        checked={selectedActions.includes(action)}
                                        onChange={() => handleActionChange(action)}
                                    />
                                    <label className="form-check-label" htmlFor={`action-${action}`}>
                                        {action}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Buttons ở dưới cùng */}
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

export default AuditLogFilterPanel;