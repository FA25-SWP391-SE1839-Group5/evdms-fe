// File: components/admin-dashboard/sales-orders/SalesOrderStatsCards.jsx
import React, { useMemo } from 'react';
import { ShoppingCart, RefreshCw, Truck, CheckCircle, XCircle, DollarSign } from 'lucide-react'; // Added DollarSign

// Helper to format currency
const formatCurrency = (amount) => typeof amount === 'number' ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount) : 'N/A';

const SalesOrderStatsCards = ({ orders = [] }) => { // Default to empty array

    const stats = useMemo(() => {
        const counts = orders.reduce((acc, order) => {
            // Normalize status, e.g., 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'
            const status = order.status?.toLowerCase() || 'unknown';
            acc[status] = (acc[status] || 0) + 1;

            // Calculate total amount for specific statuses if needed
            if (status === 'delivered' || status === 'paid') { // Assuming 'paid' might be a status
                 acc.totalRevenue = (acc.totalRevenue || 0) + (order.totalAmount || 0);
            }
             if (status === 'pending' || status === 'processing') {
                 acc.pendingAmount = (acc.pendingAmount || 0) + (order.totalAmount || 0);
             }


            return acc;
        }, {
            total: orders.length,
            totalRevenue: 0,
            pendingAmount: 0
         }); // Initialize counts
        return counts;
    }, [orders]); // Recalculate only when orders change

    // Define the cards to display
    const cardData = [
        { key: 'total', label: 'Total Orders', count: stats.total || 0, icon: <ShoppingCart size={22} />, color: 'primary' },
        { key: 'pending', label: 'Pending/Processing', count: (stats.pending || 0) + (stats.processing || 0), amount: stats.pendingAmount, icon: <RefreshCw size={22} />, color: 'warning' },
        // { key: 'processing', label: 'Processing', count: stats.processing || 0, icon: <Truck size={22} />, color: 'info' },
        { key: 'delivered', label: 'Delivered/Paid', count: (stats.delivered || 0) + (stats.paid || 0), amount: stats.totalRevenue, icon: <CheckCircle size={22} />, color: 'success' },
        { key: 'cancelled', label: 'Cancelled', count: stats.cancelled || 0, icon: <XCircle size={22}/>, color: 'danger'},
        // You can add more specific cards like 'Shipped' if needed
    ];

    return (
        <div className="row g-4 mb-4">
            {cardData.map((card) => (
                <div key={card.key} className="col-lg-3 col-md-6 col-sm-6 col-12"> {/* 4 columns on large screens */}
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex flex-column gap-1">
                                    <h4 className="mb-1">{card.count}</h4>
                                    <span className="text-muted">{card.label}</span>
                                     {/* Display amount if available */}
                                     {card.amount !== undefined && card.amount > 0 && (
                                         <small className={`text-${card.color === 'success' ? 'success' : 'warning'} fw-semibold`}>
                                             {formatCurrency(card.amount)}
                                         </small>
                                     )}
                                </div>
                                <div className={`avatar flex-shrink-0`}>
                                    <span className={`avatar-initial rounded bg-label-${card.color}`}>
                                        {card.icon}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SalesOrderStatsCards;