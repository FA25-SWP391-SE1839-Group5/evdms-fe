import React, { useMemo } from 'react';
import { Tag, CalendarCheck, CalendarX, CalendarPlus } from 'lucide-react';

const PromotionStatsCards = ({ promotions = [] }) => {

    // Tính toán số liệu thống kê
    const stats = useMemo(() => {
        const now = new Date();
        let active = 0;
        let upcoming = 0;
        let expired = 0;

        promotions.forEach(p => {
            const start = new Date(p.startDate);
            const end = new Date(p.endDate);
            if (now > end) {
                expired++;
            } else if (now < start) {
                upcoming++;
            } else {
                active++;
            }
        });

        return {
            total: promotions.length,
            active,
            upcoming,
            expired
        };
    }, [promotions]); // Tính lại khi danh sách promotions thay đổi

    const cardData = [
        { key: 'total', label: 'Total Promotions', count: stats.total, icon: <Tag size={22} />, color: 'primary' },
        { key: 'active', label: 'Active Now', count: stats.active, icon: <CalendarCheck size={22} />, color: 'success' },
        { key: 'upcoming', label: 'Upcoming', count: stats.upcoming, icon: <CalendarPlus size={22} />, color: 'info' },
        { key: 'expired', label: 'Expired', count: stats.expired, icon: <CalendarX size={22} />, color: 'secondary' },
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

export default PromotionStatsCards;