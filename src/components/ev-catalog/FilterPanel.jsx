import React from "react";
import { formatPrice } from "../../services/evService";

const FilterPanel = ({ filters, handleFilterChange, resetFilters }) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Bộ lọc</h3>
            <button
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
                Đặt lại
        </button>
      </div>
   );
};

export default FilterPanel;