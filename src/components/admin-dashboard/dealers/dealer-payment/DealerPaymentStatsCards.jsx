import React from 'react'
import React from 'react';
import { Clock, CheckCircle, XCircle, DollarSign, FileText } from 'lucide-react';

export default function DealerPaymentStatsCards({ payments }) {
    // Calculate stats
    const stats = payments.reduce((acc, payment) => {
        const status = payment.status?.toLowerCase() || 'unknown';
        acc[status] = (acc[status] || 0) + 1;
        if (status === 'paid') {
            acc.totalPaidAmount = (acc.totalPaidAmount || 0) + (payment.amount || 0);
        } else if (status === 'pending') {
            acc.totalPendingAmount = (acc.totalPendingAmount || 0) + (payment.amount || 0);
        }
        return acc;
    }, {});

    const formatCurrency = (amount = 0) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    const cardData = [
        { key: 'pending', label: 'Pending', count: stats.pending || 0, amount: stats.totalPendingAmount, icon: <Clock size={22} />, color: 'warning' },
        { key: 'paid', label: 'Paid', count: stats.paid || 0, amount: stats.totalPaidAmount, icon: <CheckCircle size={22} />, color: 'success' },
        { key: 'failed', label: 'Failed', count: stats.failed || 0, icon: <XCircle size={22} />, color: 'danger' },
        { key: 'total', label: 'Total Payments', count: payments.length, icon: <FileText size={22} />, color: 'secondary' },
    ];

    return (
        <div>

        </div>
    )
}
