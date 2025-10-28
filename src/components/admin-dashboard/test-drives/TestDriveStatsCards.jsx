import React, { useMemo } from 'react';
import { List, Clock, CheckSquare, XCircle } from 'lucide-react';

const StatCard = ({ title, value, icon, colorClass }) => (
    <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
        <div className="card">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="card-title mb-0">
                        <h4 className="mb-1">{value}</h4>
                        <small>{title}</small>
                    </div>
                    <div className={`avatar-initial bg-label-${colorClass} rounded`}>
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const TestDriveStatsCards = ({ testDrives }) => {
    const stats = useMemo(() => {
        const total = testDrives.length;
        const scheduled = testDrives.filter(td => td.status?.toLowerCase() === 'scheduled').length;
        const completed = testDrives.filter(td => td.status?.toLowerCase() === 'completed').length;
        const cancelled = testDrives.filter(td => td.status?.toLowerCase() === 'cancelled').length;
        return { total, scheduled, completed, cancelled };
    }, [testDrives]);

    return (
        <div className="row g-4 mb-4">
            <StatCard
                title="Total Bookings"
                value={stats.total}
                icon={<List size={24} />}
                colorClass="primary"
            />
            <StatCard
                title="Scheduled"
                value={stats.scheduled}
                icon={<Clock size={24} />}
                colorClass="info"
            />
            <StatCard
                title="Completed"
                value={stats.completed}
                icon={<CheckSquare size={24} />}
                colorClass="success"
            />
            <StatCard
                title="Cancelled"
                value={stats.cancelled}
                icon={<XCircle size={24} />}
                colorClass="danger"
            />
        </div>
    );
};

export default TestDriveStatsCards;