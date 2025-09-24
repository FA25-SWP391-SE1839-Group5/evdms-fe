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

                {/* Icon hành động */}
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
                
                {/* Badge giảm giá */}
                {vehicle.originalPrice > vehicle.price && (
                    <div className="absolute bottom-4 left-4">
                        <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                            Giảm {Math.round(((vehicle.originalPrice - vehicle.price) / vehicle.originalPrice) * 100)}%
                        </span>
                    </div>
                )}

                {/* Overlay khi hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                openQuickView(vehicle);
                            }}
                            className="px-4 py-2 bg-white/90 text-gray-800 rounded-lg hover:bg-white transition-colors text-sm font-medium"
                        >
                            Xem nhanh
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                openDetailPage(vehicle.id);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            Xem chi tiết
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6 cursor-pointer" onClick={() => openDetailPage(vehicle)}>
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {vehicle.name}
                        </h3>
                        <p className="text-gray-600 font-medium">
                            {vehicle.brand} • {vehicle.model}
                        </p>
                    </div>
                    <div className="flex items-center gap-1 ml-4">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{vehicle.rating}</span>
                        <span className="text-xs text-gray-500">({vehicle.reviews})</span>
                    </div>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Battery className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                        <div className="text-sm font-semibold text-blue-900">{vehicle.range} km</div>
                        <div className="text-xs text-blue-600">Phạm vi</div>
                    </div>

                    <div className="text-center p-3 bg-green-50 rounded-lg">
                        <Zap className="w-5 h-5 text-green-600 mx-auto mb-1" />
                        <div className="text-sm font-semibold text-green-900">{vehicle.chargingTime}</div>
                        <div className="text-xs text-green-600">Sạc nhanh</div>
                    </div>

                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <Gauge className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                        <div className="text-sm font-semibold text-purple-900">{vehicle.acceleration}</div>
                        <div className="text-xs text-purple-600">0-100 km/h</div>
                    </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-4">
                    {vehicle.features.slice(0, 3).map((feature, index) => (
                        <span 
                        key={index} 
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
                        >
                            {feature}
                        </span>
                    ))}
                    {vehicle.features.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                            +{vehicle.features.length - 3} khác
                        </span>
                    )}
                </div>
                )}



    )
}