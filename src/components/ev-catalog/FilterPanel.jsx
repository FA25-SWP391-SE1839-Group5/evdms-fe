import React from "react";

const FilterPanel = ({ filters, resetFilters, handleFilterChange, formatPrice }) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Bộ lọc</h3>
                <button
                    onClick={resetFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                    Đặt lại
                </button>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Khoảng giá: {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
                </label>
                <input
                    type="range"
                    min="0"
                    max="4000000000"
                    step="100000000"
                    value={filters.priceRange[1]}
                    onChange={(e) =>
                        handleFilterChange("priceRange", [filters.priceRange[0]], parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-500 rounded-lg appearance-none cursor-pointer"
                />
            </div>

            {/* Brand Filter */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Thương hiệu</label>
                <select
                    value={filters.brand}
                    onChange={(e) => handleFilterChange("brand", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Tất cả</option>
                    <option value="Tesla">Tesla</option>
                    <option value="BMW">BMW</option>
                    <option value="Audi">Audi</option>
                </select>
            </div>
        </div>
    );
};

export default FilterPanel;