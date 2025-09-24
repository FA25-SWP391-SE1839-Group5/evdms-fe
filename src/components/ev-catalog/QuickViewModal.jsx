import React from "react";
import { X, Star, Battery, Zap, Users } from "lucide-react";

const QuickViewModal = ({
    showQuickView,
    quickViewVehicle,
    setShowQuickView,
    openDetailPage,
    formatPrice,
    getAvailabilityBadge,
}) => {
    if (!showQuickView || !quickViewVehicle) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">{quickViewVehicle.name}</h2>
                    <button onClick={() => setShowQuickView(false)}>
                        <X className="w-6 h-6" />    
                    </button>
                </div>
                <div className="p-6 grid md:grid-cols-2 gap-6">
                    <img src={quickViewVehicle.images[0]} className="rounded-xl" />
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            <span>{quickViewVehicle.rating}</span>
                            {getAvailabilityBadge(quickViewVehicle.availability)}
                        </div>
                        <div className="text-2xl font-bold mb-4">
                            {formatPrice(quickViewVehicle.startingPrice)}
                        </div>
                        <button
                            onClick={() => {
                                setShowQuickView(false);
                                openDetailPage(quickViewVehicle);
                            }}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl"
                        >
                            Xem chi tiết
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickViewModal;