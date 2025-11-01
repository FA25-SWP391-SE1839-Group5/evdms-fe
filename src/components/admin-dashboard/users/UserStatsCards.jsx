import { UserCheck, Users, UserX } from "lucide-react";
import { useMemo } from "react";

export default function UserStatsCards({ users = [] }) {
  // Calculate stats using useMemo for efficiency
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.isActive).length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [users]); // Recalculate only if the users array changes

  const cardData = [
    { key: "total", label: "Total Users", count: stats.total, icon: <Users size={22} />, color: "primary" },
    { key: "active", label: "Active Users", count: stats.active, icon: <UserCheck size={22} />, color: "success" },
    { key: "inactive", label: "Inactive Users", count: stats.inactive, icon: <UserX size={22} />, color: "secondary" },
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
                </div>
                <div className={`avatar flex-shrink-0`}>
                  <span className={`avatar-initial rounded bg-label-${card.color}`}>{card.icon}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
