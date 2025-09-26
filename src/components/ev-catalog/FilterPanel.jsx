import React from "react";
import {Filter, X} from "lucide-react";

const FilterPanel = ({ filters, setFilters, brands }) => {
    const updateFilter = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value}));
    };
    
    const clearFilters = () => {
        setFilters({
            brand: "",
            priceRange: "",
            availability: "",
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <Filter className="w-5 h-5" /> Bộ lọc
                </h3>
                <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-500"
                >
                    <X className="w-4 h-4" /> Xóa bộ lọc
                </button>
            </div>
    );
   
};

export default FilterPanel;