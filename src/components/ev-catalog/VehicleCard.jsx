import React from "react";
import { Heart, GitCompare, Eye, Star, Battery, Zap, Gauge } from "lucide-react";

const VehicleCard = ({
    vehicle,
    favorites,
    compareList,
    toggleFavorite,
    toggleCompare,
    openQuickView,
    openDetailPage,
    formatPrice,
    getAvailabilityBadge,
}) => {
    return (
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 hover:scale-[1.02]">
                <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    <img
                        src={vehicle.images[0]}
                        alt={vehicle.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                        {getAvailabilityBadge(vehicle.availability)}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); 
                                toggleFavorite(vehicle.id); 
                            }}
                            className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                                favorites.has(vehicle.id)
                                    ? "bg-red-500 text-white scale-110"
                                    : "bg-white/90 text-gray-600 hover:text-red-500"
                            }`}
                            >
                                <Heart className="w-4 h-4" fill={favorites.has(vehicle.id) ? "currentColor" : "none"} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleCompare(vehicle.id);
                                }}
                                className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                                    compareList.includes(vehicle.id)
                                        ? "bg-blue-500 text-white scale-110"
                                        : "bg-white/90 text-gray-600 hover:text-blue-500"
                                }`}
                            >
                                <GitCompare className="w-4 h-4" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openQuickView(vehicle);
                                }}
                                 className="p-2 rounded-full bg-white/90 text-gray-600 hover:text-blue-500 backdrop-blur-sm transition-all hover:scale-110"
                            >
                                <Eye className="w-4 h-4" />
                            </button>
                    </div>
                </div>



    );
};

export default VehicleCard;