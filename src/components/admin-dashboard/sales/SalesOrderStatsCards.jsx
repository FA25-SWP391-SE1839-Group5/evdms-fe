// File: components/admin-dashboard/sales-orders/SalesOrderStatsCards.jsx
import React, { useMemo } from 'react';
import { ShoppingCart, RefreshCw, Truck, CheckCircle, XCircle } from 'lucide-react'; // Example icons

const SalesOrderStatsCards = ({ orders = [] }) => {
    const stats = useMemo(() => {
        const counts = orders.reduce((acc, order) => {
            // Chuẩn hóa status, ví dụ: 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'
            const status = order.status?.toLowerCase() || 'unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, { total: orders.length });
        return counts;
    }, [orders]);

    // Định nghĩa các thẻ cần hiển thị
    const cardData = [
        { key: 'total', label: 'Total Orders', count: stats.total || 0, icon: <ShoppingCart size={22} />, color: 'primary' },
        { key: 'pending', label: 'Pending', count: stats.pending || 0, icon: <RefreshCw size={22} />, color: 'warning' },
        { key: 'processing', label: 'Processing', count: stats.processing || 0, icon: <Truck size={22} />, color: 'info' }, // Assuming 'processing' status
        { key: 'delivered', label: 'Delivered', count: stats.delivered || 0, icon: <CheckCircle size={22} />, color: 'success' },
        // { key: 'shipped', label: 'Shipped', count: stats.shipped || 0, icon: <Truck size={22}/>, color: 'primary'},
        // { key: 'cancelled', label: 'Cancelled', count: stats.cancelled || 0, icon: <XCircle size={22}/>, color: 'danger'},
    ];

    return (
        <div className="row g-4 mb-4">
            {cardData.map((card) => (
                <div key={card.key} className="col-lg-3 col-md-6 col-sm-6 col-12"> {/* 4 cột */}
                    {/* ... (JSX cho card giống các component stats card khác) ... */}
                     <div className="card">
                        <div className="card-body">
                            {/* ... (Nội dung card: count, label, icon) ... */}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SalesOrderStatsCards;