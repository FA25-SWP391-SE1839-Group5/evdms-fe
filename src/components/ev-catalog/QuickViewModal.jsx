import React from "react";
import { X, Star, Battery, Zap, Users } from "lucide-react";
import { formatPrice, getAvailabilityBadge } from "../../services/evService";

const QuickViewModal = ({
    showQuickView,
    quickViewVehicle,
    setShowQuickView,
    openDetailPage,
    toggleCompare
}) => {
    if (!showQuickView || !quickViewVehicle) return null;

    const { badges, labels } = getAvailabilityBadge(quickViewVehicle.availability);

    const renderAvailabilityBadge = (availability) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${badges[availability]}`}>
            {labels[availability]}
        </span>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">{quickViewVehicle.name}</h2>
                        <button 
                            onClick={() => setShowQuickView(false)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >    
                            <X className="w-6 h-6" />    
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="p-6 grid md:grid-cols-2 gap-8">
                        {/* Images */}
                        <div>
                            <img 
                                src={quickViewVehicle.images[0]}
                                alt={quickViewVehicle.name} 
                                className="w-full h-64 object-cover rounded-xl"
                            />
                            <div className="grid grid-cols-4 gap-2 mt-4">
                                {quickViewVehicle.images.slice(0, 4).map((img, idx) => (
                                    <img 
                                        key={idx}
                                        src={img}
                                        alt={`${quickViewVehicle.name} ${idx + 1}`}
                                        className="w-full h-16 object-cover rounded-lg"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Details */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                <span className="font-medium">{quickViewVehicle.rating}</span>
                                <span className="text-gray-500">
                                    {quickViewVehicle.reviews} đánh giá
                                </span>
                                {getAvailabilityBadge (quickViewVehicle.availability)}
                            </div>

                            <div className="mb-6">
                                <div className="text-3xl font-bold text-gray-900 mb-2">
                                    {formatPrice(quickViewVehicle.startingPrice)}
                                </div>
                                <p className="text-gray-600">{quickViewVehicle.description}</p>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <Battery className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium">
                                        Phạm vi: {quickViewVehicle.range} km
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Zap className="w-5 h-5 text-green-600" />
                                    <span className="font-medium">
                                        Sạc: {quickViewVehicle.chargingTime}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 text-purple-600" />
                                    <span className="font-medium">
                                        {quickViewVehicle.settingCapacity} chỗ ngồi
                                    </span>
                                </div>
                            </div>
                            
                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowQuickView(false);
                                        openDetailPage(quickViewVehicle);
                                    }}
                                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                                >
                                    Xem chi tiết
                                </button>
                                <button
                                    onClick={() => toggleCompare(quickViewVehicle.id)}
                                    className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"

                                >
                                    So sánh
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickViewModal;