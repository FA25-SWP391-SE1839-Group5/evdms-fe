import React, { useMemo } from 'react';
import { SlidersVertical, Car, Tag } from 'lucide-react';

const VehicleVariantStatsCards = ({ variants = [], modelsMap = {} }) => {

    const stats = useMemo(() => {
        const totalVariants = variants.length;
        // Đếm số lượng Model duy nhất có Variant
        const uniqueModelIds = new Set(variants.map(v => v.modelId));
        const totalModelsWithVariants = uniqueModelIds.size;

        // Tính giá trung bình (nếu basePrice là số) - Optional
        let averagePrice = 0;
        const validPrices = variants.map(v => v.basePrice).filter(price => typeof price === 'number' && price > 0);
        if (validPrices.length > 0) {
            averagePrice = validPrices.reduce((sum, price) => sum + price, 0) / validPrices.length;
        }

        return { totalVariants, totalModelsWithVariants, averagePrice };
    }, [variants]); // Tính lại khi variants thay đổi

    const formatCurrency = (amount = 0) => {
         if (amount === 0) return 'N/A';
         return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount);
    }

    const cardData = [
        { key: 'totalVariants', label: 'Total Variants', count: stats.totalVariants, icon: <SlidersVertical size={22} />, color: 'primary' },
        { key: 'totalModels', label: 'Models with Variants', count: stats.totalModelsWithVariants, icon: <Car size={22} />, color: 'info' },
        { key: 'avgPrice', label: 'Average Price', count: formatCurrency(stats.averagePrice), icon: <Tag size={22} />, color: 'success' },
        // Thêm thẻ khác nếu cần
    ];

    return (
        <div className="row g-4 mb-4">
            {cardData.map((card) => (
                <div key={card.key} className="col-lg-4 col-md-6 col-sm-6 col-12"> {/* 3 cột */}
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex flex-column gap-1">
                                    {/* Hiển thị giá trị currency hoặc count */}
                                    <h4 className="mb-1">{card.key === 'avgPrice' ? card.count : (card.count || 0)}</h4>
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

export default VehicleVariantStatsCards;