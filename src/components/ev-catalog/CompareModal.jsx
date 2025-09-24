import React from "react";
import { X, Star,Check, Download } from "lucide-react";

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
    );
};