import React, { useMemo } from 'react';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react'; // Example icons

const QuotationStatsCards = ({ quotations = [] }) => {

    // Tính toán số liệu thống kê
    const stats = useMemo(() => {
        const counts = {
            total: quotations.length,
            pending: 0,
            accepted: 0,
            expired: 0,
            draft: 0
        };

        quotations.forEach(q => {
            // Giả định 'status' là trường chứa trạng thái
            const status = q.status?.toLowerCase();
            if (status === 'pending') counts.pending++;
            else if (status === 'accepted') counts.accepted++;
            else if (status === 'expired') counts.expired++;
            else if (status === 'draft') counts.draft++;
        });
        return counts;
    }, [quotations]); // Tính lại khi danh sách quotations thay đổi

    const cardData = [
        { key: 'total', label: 'Total Quotes', count: stats.total, icon: <FileText size={22} />, color: 'primary' },
        { key: 'pending', label: 'Pending', count: stats.pending, icon: <Clock size={22} />, color: 'warning' },
        { key: 'accepted', label: 'Accepted', count: stats.accepted, icon: <CheckCircle size={22} />, color: 'success' },
        { key: 'expired', label: 'Expired/Draft', count: stats.expired + stats.draft, icon: <XCircle size={22} />, color: 'secondary' },
    ];

    return (
        <div className="row g-4 mb-4">
            {cardData.map((card) => (
                // Chia 4 cột
                <div key={card.key} className="col-lg-3 col-md-6 col-sm-6 col-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex flex-column gap-1">
                                    <h4 className="mb-1">{card.count}</h4>
                                    <span className="text-muted">{card.label}</span>
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

export default QuotationStatsCards;