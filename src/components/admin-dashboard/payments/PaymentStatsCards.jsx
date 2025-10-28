import React, { useMemo } from 'react';
import { CreditCard, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const StatCard = ({ title, value, icon, colorClass }) => (
    <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
        <div className="card">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="card-title mb-0">
                        <h4 className="mb-1">{value}</h4>
                        <small className="fw-semibold">{title}</small>
                    </div>
                    <div className={`avatar-initial bg-label-${colorClass} rounded`}>
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const PaymentStatsCards = ({ payments }) => {
    const stats = useMemo(() => {
        const totalPayments = payments.length;
        let totalAmount = 0;
        let completedCount = 0;
        let pendingCount = 0;
        let failedCount = 0; // Giả sử có status 'Failed'

        payments.forEach(p => {
            const status = p.status?.toLowerCase();
            if (status === 'completed') {
                totalAmount += p.amount || 0;
                completedCount++;
            } else if (status === 'pending') {
                pendingCount++;
            } else if (status === 'failed') {
                failedCount++;
            }
        });

        return { totalPayments, totalAmount, completedCount, pendingCount, failedCount };
    }, [payments]);

    return (
        <div className="row g-4 mb-4">
            <StatCard
                title="Total Revenue (Completed)"
                value={formatCurrency(stats.totalAmount)}
                icon={<CreditCard size={24} />}
                colorClass="success"
            />
             <StatCard
                title="Completed Payments"
                value={stats.completedCount}
                icon={<CheckCircle size={24} />}
                colorClass="success"
            />
            <StatCard
                title="Pending Payments"
                value={stats.pendingCount}
                icon={<Clock size={24} />}
                colorClass="warning"
            />
            <StatCard
                title="Failed/Cancelled"
                value={stats.failedCount}
                icon={<AlertTriangle size={24} />}
                colorClass="danger"
            />
        </div>
    );
};

export default PaymentStatsCards;