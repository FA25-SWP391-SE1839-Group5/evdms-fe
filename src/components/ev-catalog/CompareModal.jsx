import React from "react";
import { X, Star, Check, Download } from "lucide-react";
import { getAvailabilityBadge } from "../../services/evUtils";
import { formatPrice } from "../../services/evUtils";

const CompareModal = ({ showCompare, compareList, vehicles, setShowCompare }) => {
    if (!showCompare || compareList.length < 2) return null;

    const getVehicleById = (id) => vehicles.find((v) => v.id === id);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">So sánh xe điện</h2>
                    <button 
                        onClick={() => setShowCompare(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700 bg-gray-50 rounded-tl-xl">
                                    Thông số
                                </th>
                                {compareList.map((vehicleId) => {
                                    const vehicle = getVehicleById(vehicleId);
                                    return (
                                        <th 
                                            key={vehicleId} 
                                            className="py-4 px-6 bg-gray-50 last:rounded-tr-xl"
                                        >
                                            <div className="text-center">
                                                <img 
                                                    src={vehicle.images[0]}
                                                    alt={vehicle.name} 
                                                    className="w-32 h-20 object-cover rounded-xl mx-auto mb-3 shadow-md"
                                                />
                                                <div className="font-bold text-gray-600">
                                                    {vehicle.name}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {vehicle.brand}
                                                </div>
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                        {/* Price */}
                        <tr>
                            <td className="py-4 px-6 font-medium">Giá bán</td>
                            {compareList.map((id) => {
                                const v = vehicles.find((x) => x.id === id);
                                return (
                                    <td key={id} className="py-4 px-6 text-center">
                                        <div className="text-green-600 font-bold text-lg">
                                            {formatPrice(v.startingPrice)}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>

                        {/* Rating */}
                        <tr>
                            <td className="py-4 px-6 font-medium">Đánh giá</td>
                            {compareList.map((id) => {
                                const v = vehicles.find((x) => x.id === id);
                                return (
                                    <td key={id} className="py-4 px-6 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span className="font-semibold">{v.rating}</span>
                                            <span className="text-gray-500 text-sm">({v.reviews})</span>
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                        </tbody>
                </table>

                {/* Footer */}
                <div className="flex justify-end mt-6 gap-3">
                    <button
                        onClick={() => setShowCompare(false)}
                        className="px-4 py-2 border rounded-lg"
                    >
                        Đóng
                    </button>
                    <button
                        onClick={() => alert("Tính năng tải về đang phát triển")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        <Download className="w-4 h-4 inline mr-1" />
                        Xuất so sánh
                    </button>
                </div>
            </div>
        </div>
        </div>
    );
};

export default CompareModal;