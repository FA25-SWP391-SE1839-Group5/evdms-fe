// File: components/admin-dashboard/vehicle-inventory/stock/VehicleStockStatsCards.jsx
import React, { useMemo } from 'react';
import { Car, PackageCheck, PackageX, Truck, Package } from 'lucide-react'; // Example icons

const VehicleStockStatsCards = ({ vehicles = [] }) => {

    // Tính toán số liệu thống kê
    const stats = useMemo(() => {
        const counts = {
            total: vehicles.length,
            available: 0,
            reserved: 0,
            sold: 0,
            inTransit: 0,
            new: 0,
            used: 0,
            demo: 0,
        };
        vehicles.forEach(v => {
            const status = v.status?.toLowerCase();
            const type = v.type?.toLowerCase();
            if (status === 'available') counts.available++;
            else if (status === 'reserved') counts.reserved++;
            else if (status === 'sold') counts.sold++;
            else if (status === 'intransit') counts.inTransit++;

            if (type === 'new') counts.new++;
            else if (type === 'used') counts.used++;
            else if (type === 'demo') counts.demo++;
        });
        return counts;
    }, [vehicles]); // Chỉ tính lại khi danh sách vehicles thay đổi

    // Dữ liệu cho các thẻ, bạn có thể chọn hiển thị những cái quan trọng
    const cardData = [
        { key: 'total', label: 'Total Vehicles', count: stats.total, icon: <Car size={22} />, color: 'primary' },
        { key: 'available', label: 'Available', count: stats.available, icon: <PackageCheck size={22} />, color: 'success' },
        { key: 'reserved', label: 'Reserved', count: stats.reserved, icon: <Package size={22} />, color: 'warning' },
        // { key: 'sold', label: 'Sold', count: stats.sold, icon: <PackageX size={22} />, color: 'danger' }, // Có thể ẩn thẻ Sold nếu không cần
        { key: 'inTransit', label: 'In Transit', count: stats.inTransit, icon: <Truck size={22} />, color: 'info' },
        // Thêm thẻ cho Type nếu muốn
        // { key: 'new', label: 'New Cars', count: stats.new, icon: <Car size={22} />, color: 'info' },
    ];

    return (
        <div className="row g-4 mb-4">
            {cardData.map((card) => (
                // Chia 3 cột trên màn hình lớn (lg), 2 cột trên màn hình vừa (md), 1 cột trên mobile
                <div key={card.key} className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
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

export default VehicleStockStatsCards;