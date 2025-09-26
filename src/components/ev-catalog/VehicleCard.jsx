import React from "react";
import { Heart, GitCompare, Eye, Star, Battery, Zap, Gauge } from "lucide-react";
import { formatPrice, getAvailabilityBadge } from "../../services/evService";

const VehicleCard = ({
    vehicle,
    favorites,
    compareList,
    toggleFavorite,
    toggleCompare,
    openQuickView,
    openDetailPage,
}) => {
    const { badges, labels } = getAvailabilityBadge(vehicle.availability);
    
    const renderAvailabilityBadge = (availability)= (
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${badges[availability]}`}>
            {labels[availability]}
        </span>
    );

    
    
    
};

export default VehicleCard;
