import React from "react";
import { Heart, GitCompare, Eye, Star, Battery, Zap, Gauge, ShoppingCart } from "lucide-react";


const VehcileCard = ({
    vehicle,
    openDetailPage,
    openQuickView,
    toggleFavorite,
    toggleCompare,
    favorites,
    compareList,
    formatPrice,
    getAvailabilityBadge,
}) => {
    return (
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 hover:scale-[1.02]">
            <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                <img
                    src={vehicle.image[0]}
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Badge trạng thái */}
                <div className="absolute top-4 left-4">{getAvailabilityBadge(vehicle.availability)}</div>


    )
}