import React, { useMemo } from 'react';
import { Car, SlidersVertical, Package, PackageCheck, PackageX, Truck } from 'lucide-react';

const VehicleInventoryStatsCards = ({ models = [], variants = [], vehicles = [] }) => {

    const stats = useMemo(() => {
        const totalModels = models.length;
        const totalVariants = variants.length;
        const totalStock = vehicles.length;
        const availableStock = vehicles.filter(v => v.status?.toLowerCase() === 'available').length;
        const reservedStock = vehicles.filter(v => v.status?.toLowerCase() === 'reserved').length;
        const inTransitStock = vehicles.filter(v => v.status?.toLowerCase() === 'intransit').length;

        return { totalModels, totalVariants, totalStock, availableStock, reservedStock, inTransitStock };
    }, [models, variants, vehicles]);

    const cardData = [
        { key: 'models', label: 'Total Models', count: stats.totalModels, icon: <Car size={22} />, color: 'primary' },
        { key: 'variants', label: 'Total Variants', count: stats.totalVariants, icon: <SlidersVertical size={22} />, color: 'info' },
        { key: 'stock', label: 'Total Stock Units', count: stats.totalStock, icon: <Package size={22} />, color: 'secondary' },
        { key: 'available', label: 'Available Stock', count: stats.availableStock, icon: <PackageCheck size={22} />, color: 'success' },
        { key: 'reserved', label: 'Reserved Stock', count: stats.reservedStock, icon: <Package size={22} />, color: 'warning' },
         { key: 'inTransit', label: 'In Transit Stock', count: stats.inTransitStock, icon: <Truck size={22} />, color: 'info' },
    ];

    return (
        <div className="row g-4 mb-4">
            {cardData.map((card) => (
                // Chia 3 cột trên lg, 2 trên md
                <div key={card.key} className="col-lg-4 col-md-6 col-sm-6 col-12">
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

export default VehicleInventoryStatsCards;