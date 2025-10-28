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

        <div className="space-y-6">
            {/* Price Range */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Khoảng giá: {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
                </label>
                <input
                    type="range"
                    min="0"
                    max="4000000000"
                    step="100000000"
                    value={filters.priceRange[1]}
                    onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-500 rounded-lg appearance-none cursor-pointer"
                />
            </div>

            {/* Range */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phạm vi hoạt động: {filters.range[0]} - {filters.range[1]} km
                </label>
                <input
                    type="range"
                    min="0"
                    max="600"
                    step="10"
                    value={filters.range[1]}
                    onChange={(e) => handleFilterChange('range', [filters.range[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gradient-to-r from-green-200 to-green-500 rounded-lg appearance-none cursor-pointer"
                />
            </div>

            {/* Brand */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thương hiệu</label>
                <select
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">Tất cả thương hiệu</option>
                    <option value="Tesla">Tesla</option>
                    <option value="BMW">BMW</option>
                    <option value="Audi">Audi</option>
                    <option value="Hyundai">Hyundai</option>
                    <option value="Ford">Ford</option>
                    <option value="Lucid">Lucid</option>
                </select>
            </div>

            {/* Body Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kiểu dáng</label>
                <select
                    value={filters.bodyType}
                    onChange={(e) => handleFilterChange('bodyType', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">Tất cả kiểu dáng</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Coupe">Coupe</option>
                    <option value="Hatchback">Hatchback</option>
                </select>
            </div>

            {/* Availability */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tình trạng</label>
                <select
                    value={filters.availability}
                    onChange={(e) => handleFilterChange('availability', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="all">Tất cả</option>
                    <option value="in-stock">Có sẵn</option>
                    <option value="pre-order">Đặt trước</option>
                    <option value="out-of-stock">Hết hàng</option>
                </select>
            </div>
        </div>
    </div>
   );
};

export default FilterPanel;