import React from "react";
import { X, Star, Battery, Zap, Users } from "lucide-react";
import { formatPrice, getAvailabilityBadge } from "../../services/evUtils";

const QuickViewModal = ({
    showQuickView,
    quickViewVehicle,
    setShowQuickView,
    openDetailPage,
}) => {
    if (!showQuickView || !quickViewVehicle) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">{quickViewVehicle.name}</h2>
                        <button onClick={() => setShowQuickView(false)}>
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

                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickViewModal;