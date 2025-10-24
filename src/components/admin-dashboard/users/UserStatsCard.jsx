import React, { useMemo } from 'react';
import { Users, UserCheck, UserX } from 'lucide-react';

export default function UserStatsCard({ users = [] }) {
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
        <div>
            
        </div>
    )
}
