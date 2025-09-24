import React from "react";
import { X, Star,Check, Download } from "lucide-react";
import { getAvailabilityBadge } from "../../services/evUtils";

const CompareModal = ({ showCompare, compareList, vehicles, setShowCompare, formatPrice }) => {
    if (!showCompare || compareList.length < 2) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between">
                <h2 className="text-2xl font-bold">So sánh xe</h2>
                <button onClick={() => setShowCompare(false)}>
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left py-4 px-6">Thông số</th>
                            {compareList.map((id) => {
                                const v = vehicles.find((x) => x.id === id);
                                return (
                                    <th key={id} className="py-4 px-6 text-center">
                                        <img 
                                            src={v.images[0]}
                                            alt={v.name} 
                                            className="w-32 h-20 object-cover rounded-lg mx-auto mb-2" 
                                        />
                                        <div className="font-bold">{v.name}</div>
                                        <div className="text-sm text-gray-600">{v.brand}</div>
                                        {getAvailabilityBadge(v.availability)}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="divide-y">

                        {/* Price */}
    );
};