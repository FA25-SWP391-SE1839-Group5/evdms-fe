// File: components/admin-dashboard/dealers/dealer-orders/OrderStatsCards.jsx
import React from 'react';
import { Calendar, CheckCircle, XCircle, Clock, Truck, FileText } from 'lucide-react'; // Import thêm icons

const OrderStatsCards = ({ orders }) => {
    // Tính toán số lượng order theo từng trạng thái
    const stats = orders.reduce((acc, order) => {
        const status = order.status?.toLowerCase();
        if (status) {
            acc[status] = (acc[status] || 0) + 1;
        }
        return acc;
    }, {});

    // Định nghĩa các trạng thái và icon tương ứng
    const orderStatuses = [
        { key: 'pending', label: 'Pending', icon: <Clock size={22} />, color: 'warning' },
        { key: 'processing', label: 'Processing', icon: <Truck size={22} />, color: 'info' },
        { key: 'shipped', label: 'Shipped', icon: <Calendar size={22} />, color: 'primary' }, // Changed icon for Shipped
        { key: 'delivered', label: 'Delivered', icon: <CheckCircle size={22} />, color: 'success' },
        { key: 'cancelled', label: 'Cancelled', icon: <XCircle size={22} />, color: 'danger' },
    ];

    return (
        <div className="row g-4 mb-4">
            {orderStatuses.map((status) => (
                <div key={status.key} className="col-lg-2 col-md-4 col-6">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div className="d-flex flex-column gap-1">
                                    <h4 className="mb-2">{stats[status.key] || 0}</h4>
                                    <span className="text-muted">{status.label}</span>
                                </div>
                                <div className={`avatar flex-shrink-0 me-3`}>
                                    <span className={`avatar-initial rounded bg-label-${status.color}`}>
                                        {status.icon}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            {/* Nếu muốn thêm tổng số orders */}
            <div className="col-lg-2 col-md-4 col-6">
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex justify-content-between">
                            <div className="d-flex flex-column gap-1">
                                <h4 className="mb-2">{orders.length}</h4>
                                <span className="text-muted">Total Orders</span>
                            </div>
                            <div className="avatar flex-shrink-0 me-3">
                                <span className="avatar-initial rounded bg-label-secondary">
                                    <FileText size={22} /> {/* Using FileText icon for total, you can change it */}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderStatsCards;