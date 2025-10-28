import React, { useMemo } from 'react';
import { Users, UserCheck, UserX } from 'lucide-react';

export default function UserStatsCards({ users = [] }) {
    // Calculate stats using useMemo for efficiency
    const stats = useMemo(() => {
        const total = users.length;
        const active = users.filter(u => u.isActive).length;
        const inactive = total - active;
        // You could add role-specific counts here if needed later
        return { total, active, inactive };
    }, [users]); // Recalculate only if the users array changes

    const cardData = [
        { key: 'total', label: 'Total Users', count: stats.total, icon: <Users size={22} />, color: 'primary' },
        { key: 'active', label: 'Active Users', count: stats.active, icon: <UserCheck size={22} />, color: 'success' },
        { key: 'inactive', label: 'Inactive Users', count: stats.inactive, icon: <UserX size={22} />, color: 'secondary' },
        // Add more cards based on your needs, maybe pending if that status exists
    ];

    return (
        <div className="row g-4 mb-4">
            {cardData.map((card) => (
                // Adjust column size if you add/remove cards (e.g., col-lg-3 for 4 cards)
                <div key={card.key} className="col-lg-4 col-md-6 col-sm-6 col-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex flex-column gap-1">
                                    <h4 className="mb-1">{card.count}</h4>
                                    <span className="text-muted">{card.label}</span>
                                    {/* Optional: Add percentage or description like in example */}
                                    <small className="text-success fw-semibold">
                                        <i className="bx bx-up-arrow-alt"></i> +29%
                                    </small>
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
    )
}